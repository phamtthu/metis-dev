import { Type } from 'class-transformer';
import { User } from 'src/model/user/user.shema';
import { ResourceCategoryResponse } from './resource-category-response';

export class ResourceCategoriesResponse {
  @Type(() => ResourceCategoryResponse)
  data: ResourceCategoryResponse[];

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
  constructor(partial: Partial<ResourceCategoriesResponse>) {
    Object.assign(this, partial);
  }
}
