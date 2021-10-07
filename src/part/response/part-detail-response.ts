import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { PartResponse } from './part-response';
import { PartCategoryResponse } from 'src/part-category/response/part-category-response';
import { ProductResponse } from 'src/product/response/product-response';

@Exclude()
export class PartDetailResponse extends PartResponse {
  @Expose()
  @Type(() => PartCategoryResponse)
  category: PartCategoryResponse;

  @Expose()
  @Type(() => ProductResponse)
  products: ProductResponse;

  constructor(partial: Partial<PartDetailResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}
