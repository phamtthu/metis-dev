import { Type } from 'class-transformer';
import { ResourceResponse } from './resource-response';

export class ResourcesResponse {
  @Type(() => ResourceResponse)
  data: ResourceResponse[];

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
  constructor(partial: Partial<ResourcesResponse>) {
    Object.assign(this, partial);
  }
}
