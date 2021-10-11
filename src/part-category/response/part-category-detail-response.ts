import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { PartCategoryResponse } from './part-category-response';

@Exclude()
export class PartCategoryDetailResponse extends PartCategoryResponse {
  @Expose()
  sub_categoriesID: string[];

  constructor(partial: Partial<PartCategoryDetailResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}
