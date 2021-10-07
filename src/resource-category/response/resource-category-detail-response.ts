import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { ResourceCategoryResponse } from './resource-category-response';

@Exclude()
export class ResourceCategoryDetailResponse extends ResourceCategoryResponse {
  @Expose()
  sub_categoriesID: string[];

  constructor(partial: Partial<ResourceCategoryDetailResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}
