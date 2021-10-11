import { Type } from 'class-transformer';
import { TaskStatusResponse } from './task-status-response';

export class TaskStatusesResponse {
  @Type(() => TaskStatusResponse)
  data: TaskStatusResponse[];

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
  constructor(partial: Partial<TaskStatusesResponse>) {
    Object.assign(this, partial);
  }
}
