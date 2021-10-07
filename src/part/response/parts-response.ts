import { Type } from 'class-transformer';
import { PartResponse } from './part-response';

export class PartsResponse {
  @Type(() => PartResponse)
  data: PartResponse[];

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
  constructor(partial: Partial<PartsResponse>) {
    Object.assign(this, partial);
  }
}
