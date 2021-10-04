import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwSrvErr } from 'src/common/utils/error';
import { Customer } from 'src/model/customer/customer.schema';
import { OrderProduct } from 'src/model/order-product/order-product.schema';
import { Order } from 'src/model/order/order.schema';
import { generateRandomCode } from 'src/shared/helper';
import { AddCustomerDTO } from './dto/add-customer.dto';
import { UpdateCustomerDTO } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel('Customer') private customerModel: PaginateModel<Customer>,
    @InjectModel('Order') private orderModel: Model<Order>,
    @InjectModel('Order_Product')
    private orderProductModel: Model<OrderProduct>,
  ) {}

  async create(customerDTO: AddCustomerDTO) {
    try {
      const customers = await this.customerModel.find();
      const codes = customers.map((e) => e.customer_no);
      return await new this.customerModel({
        customer_no: generateRandomCode(codes),
        ...customerDTO,
      }).save();
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getList(queryDto: PaginationQueryDto) {
    try {
      const searchRegex = new RegExp(queryDto.search, 'i');

      const query = {
        $or: [
          { name: { $regex: searchRegex } },
          { customer_no: { $regex: searchRegex } },
        ],
      };
      if (queryDto.offset >= 0 && queryDto.limit >= 0) {
        const options = {
          offset: queryDto.offset,
          limit: queryDto.limit,
          sort: { created_at: SortQuery.Desc },
          customLabels: {
            page: 'page',
            limit: 'per_page',
            totalDocs: 'total',
            totalPages: 'total_pages',
            docs: 'data',
          },
        };
        return await this.customerModel.paginate(query, options);
      } else
        return await this.customerModel
          .find(query)
          .sort({ created_at: SortQuery.Desc });
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getDetail(customerId: string) {
    try {
      const customer = await this.checkCustomerIsExist(customerId);
      const orders = await this.orderModel.find({ customer: customerId });
      customer['orders'] = orders;
      return customer;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async delete(customerId: string) {
    try {
      const deletedCustomer = await this.customerModel.findByIdAndDelete(
        customerId,
      );
      if (!deletedCustomer) throw new NotFoundException('User is not exist');
      const orders = await this.orderModel.find({ customer: customerId });
      await this.orderModel.deleteMany({ customer: customerId });
      const orderIds = orders.map((e) => String(e._id));
      await this.orderProductModel.deleteMany({
        order: { $in: orderIds },
      });
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async update(customerId: string, customerDTO: UpdateCustomerDTO) {
    try {
      const newCustomer = await this.customerModel.findByIdAndUpdate(
        customerId,
        customerDTO,
        { new: true },
      );
      if (!newCustomer) throw new NotFoundException('User is not exist');
      return newCustomer;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async checkCustomerIsExist(customerId: string) {
    try {
      const customer = await this.customerModel.findById(customerId).lean();
      if (!customer) throw new NotFoundException('User is not exist');
      return customer;
    } catch (error) {
      throwSrvErr(error);
    }
  }
}
