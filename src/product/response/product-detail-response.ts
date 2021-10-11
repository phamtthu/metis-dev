import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { ProductResponse } from './product-response';
import { TaskResponse } from 'src/task/response/task-response';
import { PartResponse } from 'src/part/response/part-response';
import { OrderResponse } from 'src/order/response/order-response';
import { OrderProductResponse } from 'src/order/response/oder-product-response';
import { ProductPartResponse } from './product-part-response';

@Exclude()
export class ProductDetailResponse extends ProductResponse {
  @Expose()
  @Type(() => OrderProductResponse)
  orders: OrderProductResponse[];

  @Expose()
  @Type(() => ProductPartResponse)
  parts: ProductPartResponse[];

  @Expose()
  @Type(() => TaskResponse)
  tasks: TaskResponse[];

  constructor(partial: Partial<ProductDetailResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}
