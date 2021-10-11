import { Type } from 'class-transformer';
import { OrderDetailResponse } from './order-detail-response';

export class OrdersResponse {
  @Type(() => OrderDetailResponse)
  data: OrderDetailResponse[];

  total: number;
  offset: number;
  per_page: number;
  total_pages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: Boolean;
  hasNextPage: Boolean;
  prevPage: number | null;
  nextPage: number | null;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(partial: Partial<OrdersResponse>) {
    Object.assign(this, partial);
  }
}
