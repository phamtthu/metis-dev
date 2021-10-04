import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo, PaginateModel, Types } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwSrvErr } from 'src/common/utils/error';
import { Customer } from 'src/model/customer/customer.schema';
import { OrderProduct } from 'src/model/order-product/order-product.schema';
import { Order } from 'src/model/order/order.schema';
import { Product } from 'src/model/product/product.schema';
import { paginator } from 'src/shared/helper';
import { Product as MultiProduct } from './dto/add-order.dto';
import { AddOrderDTO } from './dto/add-order.dto';
import { UpdateOrderDTO } from './dto/update-product.dto';

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
      const order = await new this.orderModel(orderDTO).save();
      await this.addOrderProduct(order._id, orderDTO.products);
      return order;
    } catch (error) {
      throwSrvErr(error);
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
            description: {
              $first: '$description',
            },
            customer: {
              $first: '$customer',
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
        return paginator(orders, queryDto.offset, queryDto.limit);
      } else return orders;
    } catch (error) {
      throwSrvErr(error);
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
      return order;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async delete(orderId: string) {
    try {
      const deletedOrder = await this.orderModel.findByIdAndDelete(orderId);
      if (!deletedOrder) throw new NotFoundException('Order is not exist');
      await this.orderProductModel.deleteMany({ order: orderId });
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async update(orderId: string, orderDTO: UpdateOrderDTO) {
    try {
      const newOrder = await this.orderModel.findByIdAndUpdate(
        orderId,
        orderDTO,
        { new: true },
      );
      if (!newOrder) throw new NotFoundException('Order is not exist');
      await this.orderProductModel.deleteMany({ order: orderId });
      await this.addOrderProduct(orderId, orderDTO.products);
      return newOrder;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async addOrderProduct(orderId: string, products: MultiProduct[]) {
    try {
      const orderProducts = products.map((e) => ({
        order: orderId,
        product: e.product,
        quantity: e.quantity,
      }));
      await this.orderProductModel.insertMany(orderProducts);
    } catch (error) {
      throwSrvErr(error);
    }
  }
}
