import { Type } from 'class-transformer';
import { ProductCategoryResponse } from './product-category-response';

export class ProductCategoriesResponse {
  @Type(() => ProductCategoryResponse)
  data: ProductCategoryResponse[];

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
  constructor(partial: Partial<ProductCategoriesResponse>) {
    Object.assign(this, partial);
  }
}
