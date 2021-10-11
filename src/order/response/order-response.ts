import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { CustomerResponse } from 'src/customer/response/customer-response';

@Exclude()
export class OrderResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  @Type(() => CustomerResponse)
  customer: string | CustomerResponse;

  @Expose()
  po_no: string;

  @Expose()
  start_date: Date;

  @Expose()
  date_scheduled: Date;

  @Expose()
  date_fulfilled: Date;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  __v: number;

  constructor(partial: Partial<OrderResponse>) {
    Object.assign(this, partial);
  }
}
