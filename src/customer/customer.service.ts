import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { classToPlain } from 'class-transformer';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { errorException } from 'src/common/utils/error';
import { Customer } from 'src/model/customer/customer.schema';
import { OrderProduct } from 'src/model/order-product/order-product.schema';
import { Order } from 'src/model/order/order.schema';
import { generateRandomCode, paginator, toJsObject } from 'src/shared/helper';
import { AddCustomerDTO } from './dto/add-customer.dto';
import { UpdateCustomerDTO } from './dto/update-customer.dto';
import { CustomerDetailResponse } from './response/customer-detail-response';
import { CustomerResponse } from './response/customer-response';
import { CustomersResponse } from './response/customers-response';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel('Customer') private customerModel: PaginateModel<Customer>,
    @InjectModel('Order') private orderModel: Model<Order>,
    @InjectModel('Order_Product')
    private orderProductModel: Model<OrderProduct>,
  ) {}

  async create(customerDTO: AddCustomerDTO) {
    // try {
    const customers = await this.customerModel.find();
    const codes = customers.map((e) => e.customer_no);
    const customer = await new this.customerModel({
      customer_no: generateRandomCode(codes),
      ...customerDTO,
    }).save();
    return classToPlain(new CustomerResponse(toJsObject(customer)));
    // } catch (error) {
    //   errorException(error);
    // }
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
        const customers = await this.customerModel.paginate(query, options);
        return classToPlain(new CustomersResponse(toJsObject(customers)));
      } else {
        const customers = await this.customerModel
          .find(query)
          .sort({ created_at: SortQuery.Desc });
        return classToPlain(
          new CustomersResponse(
            toJsObject(paginator(customers, 0, customers.length)),
          ),
        );
      }
    } catch (error) {
      errorException(error);
    }
  }

  async getDetail(customerId: string) {
    // try {
    const customer = await this.checkCustomerIsExist(customerId);
    const orders = await this.orderModel.find({ customer: customerId });
    customer['orders'] = orders;
    //   throw new NotFoundException()
    return classToPlain(new CustomerDetailResponse(toJsObject(customer)));
    // } catch (error) {
    //   errorException(error);
    // }
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
      errorException(error);
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
      return classToPlain(new CustomerResponse(toJsObject(newCustomer)));
    } catch (error) {
      errorException(error);
    }
  }

  async checkCustomerIsExist(customerId: string) {
    // try {
    const customer = await this.customerModel.findById(customerId).lean();
    if (!customer) throw new NotFoundException('User is not exist');
    return customer;
    // } catch (error) {
    //   errorException(error);
    // }
  }
}
