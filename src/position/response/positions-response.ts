import { Type } from 'class-transformer';
import { PositionResponse } from './position-response';

export class PositionsResponse {
  @Type(() => PositionResponse)
  data: PositionResponse[];

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
  constructor(partial: Partial<PositionsResponse>) {
    Object.assign(this, partial);
  }
}
