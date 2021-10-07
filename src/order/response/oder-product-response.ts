import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { ProductResponse } from 'src/product/response/product-response';
import { OrderResponse } from './order-response';

@Exclude()
export class OrderProductResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  @Type(() => ProductResponse)
  product: string | ProductResponse;

  @Expose()
  @Type(() => OrderResponse)
  order: string | OrderResponse;

  @Expose()
  quantity: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  __v: number;

  constructor(partial: Partial<OrderProductResponse>) {
    Object.assign(this, partial);
  }
}
