import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwSrvErr } from 'src/common/utils/error';
import { Customer } from 'src/model/customer.schema';
import { Order } from 'src/model/order.schema';
import { AddCustomerDTO } from './dto/add-customer.dto';
import { UpdateCustomerDTO } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel('Customer') private customerModel: PaginateModel<Customer>,
    @InjectModel('Order') private orderModel: Model<Order>,
  ) {}

  async create(customerDTO: AddCustomerDTO) {
    try {
      return await new this.customerModel(customerDTO).save();
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getList(paginateQuery: PaginationQueryDto, search: string) {
    try {
      const searchRegex = new RegExp(search, 'i');

      const query = {
        $or: [
          { name: { $regex: searchRegex } },
          { customer_no: { $regex: searchRegex } },
        ],
      };
      if (paginateQuery.offset >= 0 && paginateQuery.limit >= 0) {
        const options = {
          offset: paginateQuery.offset,
          limit: paginateQuery.limit,
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
      return await this.customerModel.findById(customerId).populate('orders');
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async delete(customerId: string) {
    try {
      const deletedCustomer = await this.customerModel.findByIdAndDelete(
        customerId,
      );
      // Order
      await this.orderModel.updateMany(
        { customer: customerId },
        { customer: null },
      );
      return deletedCustomer;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async update(customerId: string, customerDTO: UpdateCustomerDTO) {
    try {
      return await this.customerModel.findByIdAndUpdate(
        customerId,
        customerDTO,
        { new: true },
      );
    } catch (error) {
      throwSrvErr(error);
    }
  }
}
