import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { ProductCategoryResponse } from './product-category-response';

@Exclude()
export class ProductCategoryDetailResponse extends ProductCategoryResponse {
  @Expose()
  sub_categoriesID: string[];

  constructor(partial: Partial<ProductCategoryDetailResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}
