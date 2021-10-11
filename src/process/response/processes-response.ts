import { Type } from 'class-transformer';
import { ProcessResponse } from './process-response';

export class ProcessesResponse {
  @Type(() => ProcessResponse)
  data: ProcessResponse[];

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
  constructor(partial: Partial<ProcessesResponse>) {
    Object.assign(this, partial);
  }
}
