import { Type } from 'class-transformer';
import { User } from 'src/model/user/user.shema';
import { PartCategoryResponse } from './part-category-response';

export class PartCategoriesResponse {
  @Type(() => PartCategoryResponse)
  data: PartCategoryResponse[];

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
  constructor(partial: Partial<PartCategoriesResponse>) {
    Object.assign(this, partial);
  }
}
