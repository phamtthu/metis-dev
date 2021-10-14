import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { TaskStatusResponse } from 'src/task-status/response/task-status-response';
import { SumaryTaskResponse } from './summary-task-response';

@Exclude()
export class TaskGroupResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  name: string;

  @Expose()
  @Type(() => TaskStatusResponse)
  status: TaskStatusResponse;

  @Expose()
  cover_background: string;

  @Expose()
  board: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  @Type(() => SumaryTaskResponse)
  tasks: SumaryTaskResponse;

  __v: number;

  constructor(partial: Partial<TaskGroupResponse>) {
    Object.assign(this, partial);
  }
}
