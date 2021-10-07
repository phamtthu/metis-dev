import { Type } from 'class-transformer';
import { ProductResponse } from './product-response';

export class ProductsResponse {
  @Type(() => ProductResponse)
  data: ProductResponse[];

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
  constructor(partial: Partial<ProductsResponse>) {
    Object.assign(this, partial);
  }
}
