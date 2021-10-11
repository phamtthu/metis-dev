import { Type } from 'class-transformer';
import { TaskDetailResponse } from './task-detail-response';
import { TaskResponse } from './task-response';

export class TasksResponse {
  @Type(() => TaskDetailResponse)
  data: TaskDetailResponse[];

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
  constructor(partial: Partial<TasksResponse>) {
    Object.assign(this, partial);
  }
}
