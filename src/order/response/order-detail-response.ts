import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { CustomerResponse } from 'src/customer/response/customer-response';
import { OrderResponse } from './order-response';
import { OrderProductResponse } from './oder-product-response';

@Exclude()
export class OrderDetailResponse extends OrderResponse {
  @Expose()
  @Type(() => CustomerResponse)
  customer: CustomerResponse;

  @Expose()
  @Type(() => OrderProductResponse)
  products: OrderProductResponse[];

  constructor(partial: Partial<OrderDetailResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}
