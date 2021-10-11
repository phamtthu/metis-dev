import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { OrderResponse } from 'src/order/response/order-response';
import { CustomerResponse } from './customer-response';

@Exclude()
export class CustomerDetailResponse extends CustomerResponse {
  @Expose()
  @Type(() => OrderResponse)
  orders: OrderResponse[];

  constructor(partial: Partial<CustomerDetailResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}
