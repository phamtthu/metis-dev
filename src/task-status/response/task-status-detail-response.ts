import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { TaskResponse } from 'src/task/response/task-response';
import { TaskStatusResponse } from './task-status-response';

@Exclude()
export class TaskStatusDetailResponse extends TaskStatusResponse {
  @Expose()
  @Type(() => TaskResponse)
  tasks: TaskResponse[];

  constructor(partial: Partial<TaskStatusDetailResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}
