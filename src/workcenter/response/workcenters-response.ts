import { Exclude, Expose, Type } from 'class-transformer';
import { WorkCenterResponse } from './workcenter-response';

export class WorkCentersResponse {
  @Type(() => WorkCenterResponse)
  data: WorkCenterResponse[];

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
  constructor(partial: Partial<WorkCentersResponse>) {
    Object.assign(this, partial);
  }
}
