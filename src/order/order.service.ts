import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwSrvErr } from 'src/common/utils/error';
import { Customer } from 'src/model/customer.schema';
import { Order } from 'src/model/order.schema';
import { Product } from 'src/model/product.schema';
import { isTwoArrayEqual } from 'src/shared/helper';
import { AddOrderDTO } from './dto/add-order.dto';
import { UpdateOrderDTO } from './dto/update-product.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private orderModel: PaginateModel<Order>,
    @InjectModel('Customer') private customerModel: Model<Customer>,
    @InjectModel('Product') private productModel: Model<Product>,
  ) {}

  async create(orderDTO: AddOrderDTO) {
    try {
      const result = await this.orderModel.findOne({ po_no: orderDTO.po_no });
      if (result) throw new ConflictException('po_no is already exist');
      const order = await new this.orderModel(orderDTO).save();
      // Customer
      await this.customerModel.findByIdAndUpdate(orderDTO.customer, {
        $push: { orders: order._id },
      });
      // Product
      await this.productModel.updateMany(
        { _id: { $in: order.products.map((e) => e.product) } },
        { $push: { orders: order._id } },
      );
      return order;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getList(paginateQuery: PaginationQueryDto, search: string) {
    try {
      const searchRegex = new RegExp(search, 'i');
      const query = {
        $or: [
          { customer: { $regex: searchRegex } },
          { po_no: { $regex: searchRegex } },
        ],
      };
      const populateOption = {
        path: 'products.product',
        model: 'Product',
        select: 'name',
      };
      if (paginateQuery.offset >= 0 && paginateQuery.limit >= 0) {
        const options = {
          offset: paginateQuery.offset,
          limit: paginateQuery.limit,
          sort: { created_at: SortQuery.Desc },
          populate: populateOption,
          customLabels: {
            page: 'page',
            limit: 'per_page',
            totalDocs: 'total',
            totalPages: 'total_pages',
            docs: 'data',
          },
        };
        return await this.orderModel.paginate(query, options);
      } else
        return await this.orderModel
          .find(query)
          .populate(populateOption)
          .sort({ created_at: SortQuery.Desc });
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getDetail(orderId: string) {
    try {
      return await this.orderModel
        .findById(orderId)
        .populate('products.product');
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async delete(orderId: string) {
    try {
      const deletedOrder = await this.orderModel.findByIdAndDelete(orderId);
      // Customer
      await this.customerModel.findByIdAndUpdate(deletedOrder.customer, {
        $pull: { orders: orderId },
      });
      // Product
      // for await (const e of deletedOrder.products) {
      //     await this.productModel.findByIdAndUpdate(
      //         e.product,
      //         { $pull: { orders: orderId } })
      // }
      await this.productModel.updateMany(
        { orders: orderId },
        { $pull: { orders: orderId } },
      );
      return deletedOrder;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async update(orderId: string, orderDTO: UpdateOrderDTO) {
    try {
      const oldOrder = await this.orderModel.findById(orderId);
      const newOrder = await this.orderModel.findByIdAndUpdate(
        orderId,
        orderDTO,
        { new: true },
      );
      // Customer
      if (String(orderDTO.customer) !== String(oldOrder.customer)) {
        await this.customerModel.findByIdAndUpdate(oldOrder.customer, {
          $pull: { orders: orderId },
        });
        await this.customerModel.findByIdAndUpdate(orderDTO.customer, {
          $push: { orders: orderId },
        });
      }
      // Product
      const oldProductIds = oldOrder.products.map((e) => String(e.product));
      const newProductIds = orderDTO.products.map((e) => String(e.product));
      if (!isTwoArrayEqual(oldProductIds, newProductIds)) {
        const removedProducts = oldProductIds.filter(
          (productId) => !newProductIds.includes(String(productId)),
        );

        const incomingProducts = newProductIds.filter(
          (productId) => !oldProductIds.includes(String(productId)),
        );

        for await (const productId of removedProducts) {
          await this.productModel.findByIdAndUpdate(productId, {
            $pull: { orders: orderId },
          });
        }

        for await (const productId of incomingProducts) {
          await this.productModel.findByIdAndUpdate(productId, {
            $push: { orders: orderId },
          });
        }
      }
      return newOrder;
    } catch (error) {
      throwSrvErr(error);
    }
  }
}
