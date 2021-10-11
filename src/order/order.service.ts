import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { classToPlain } from 'class-transformer';
import { Model, mongo, PaginateModel, Types } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { errorException } from 'src/common/utils/error';
import { Customer } from 'src/model/customer/customer.schema';
import { OrderProduct } from 'src/model/order-product/order-product.schema';
import { Order } from 'src/model/order/order.schema';
import { Product } from 'src/model/product/product.schema';
import { generateRandomCode, paginator, toJsObject } from 'src/shared/helper';
import { Product as MultiProduct } from './dto/add-order.dto';
import { AddOrderDTO } from './dto/add-order.dto';
import { UpdateOrderDTO } from './dto/update-product.dto';
import { OrderDetailResponse } from './response/order-detail-response';
import { OrderResponse } from './response/order-response';
import { OrdersResponse } from './response/orders-response';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order')
    private orderModel: PaginateModel<Order>,
    @InjectModel('Product')
    private productModel: Model<Product>,
    @InjectModel('Order_Product')
    private orderProductModel: Model<OrderProduct>,
    @InjectModel('Customer')
    private customerModel: Model<Customer>,
  ) {}

  async create(orderDTO: AddOrderDTO) {
    try {
      const codes = (await this.orderModel.find()).map((e) => e.po_no);
      const order = await new this.orderModel({
        po_no: generateRandomCode(codes),
        ...orderDTO,
      }).save();
      await this.addOrderProduct(order._id, orderDTO.products);
      return order;
    } catch (error) {
      errorException(error);
    }
  }

  async getList(queryDto: PaginationQueryDto) {
    try {
      const searchRegex = new RegExp(queryDto.search, 'i');
      const query = [
        {
          $match: {
            $or: [
              { customer: { $regex: searchRegex } },
              { po_no: { $regex: searchRegex } },
            ],
          },
        },
        {
          $lookup: {
            from: 'customers',
            localField: 'customer',
            foreignField: '_id',
            as: 'customer',
          },
        },
        {
          $unwind: '$customer',
        },
        {
          $lookup: {
            from: 'order_products',
            localField: '_id',
            foreignField: 'order',
            as: 'products',
          },
        },
        {
          $unwind: '$products',
        },
        {
          $lookup: {
            from: 'products',
            localField: 'products.product',
            foreignField: '_id',
            as: 'products.product',
          },
        },
        {
          $unwind: '$products.product',
        },
        {
          $group: {
            _id: '$_id',
            customer: {
              $first: '$customer',
            },
            po_no: {
              $first: '$po_no',
            },
            start_date: {
              $first: '$start_date',
            },
            date_scheduled: {
              $first: '$date_scheduled',
            },
            date_fulfilled: {
              $first: '$date_fulfilled',
            },
            products: {
              $push: '$products',
            },
            // Push More here
          },
        },
      ];
      const orders = await this.orderModel.aggregate(query);
      if (queryDto.offset >= 0 && queryDto.limit >= 0) {
        return classToPlain(
          new OrdersResponse(
            toJsObject(paginator(orders, queryDto.offset, queryDto.limit)),
          ),
        );
      } else
        return classToPlain(
          new OrdersResponse(toJsObject(paginator(orders, 0, orders.length))),
        );
    } catch (error) {
      errorException(error);
    }
  }

  async getDetail(orderId: string) {
    try {
      const order = await this.orderModel
        .findById(orderId)
        .populate('customer')
        .lean();
      const orderProducts = await this.orderProductModel
        .find({ order: orderId })
        .populate('product');
      order['products'] = orderProducts.map((e) => ({
        product: e.product,
        quantity: e.quantity,
      }));
      return classToPlain(new OrderDetailResponse(toJsObject(order)));
    } catch (error) {
      errorException(error);
    }
  }

  async delete(orderId: string) {
    try {
      const deletedOrder = await this.orderModel.findByIdAndDelete(orderId);
      if (!deletedOrder) throw new NotFoundException('Order is not exist');
      await this.orderProductModel.deleteMany({ order: orderId });
    } catch (error) {
      errorException(error);
    }
  }

  async update(orderId: string, orderDTO: UpdateOrderDTO) {
    try {
      const newOrder = await this.orderModel
        .findByIdAndUpdate(orderId, orderDTO, { new: true })
        .lean();
      if (!newOrder) throw new NotFoundException('Order is not exist');
      await this.orderProductModel.deleteMany({ order: orderId });
      newOrder['products'] = await this.addOrderProduct(
        orderId,
        orderDTO.products,
      );
      return classToPlain(new OrderDetailResponse(toJsObject(newOrder)));
    } catch (error) {
      errorException(error);
    }
  }

  async addOrderProduct(orderId: string, products: MultiProduct[]) {
    try {
      const orderProducts = products.map((e) => ({
        order: orderId,
        product: e.product,
        quantity: e.quantity,
      }));
      return await this.orderProductModel.insertMany(orderProducts);
    } catch (error) {
      errorException(error);
    }
  }
}
