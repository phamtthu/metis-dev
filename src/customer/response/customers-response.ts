import { Type } from 'class-transformer';
import { CustomerResponse } from './customer-response';

export class CustomersResponse {
  @Type(() => CustomerResponse)
  data: CustomerResponse[];

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
  constructor(partial: Partial<CustomersResponse>) {
    Object.assign(this, partial);
  }
}
