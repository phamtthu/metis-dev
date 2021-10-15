import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { LabelResponse } from 'src/label/response/label-response';
import { TaskGroupResponse } from 'src/task-group/response/task-group-response.dto';

@Exclude()
export class TaskResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  name: string;

  @Expose()
  task_no: string;

  @Expose()
  priority: number;

  @Expose()
  description: string;

  @Expose()
  plan_start_date: Date;

  @Expose()
  plan_end_date: Date;

  @Expose()
  cover_background: string;

  @Expose()
  index: number;

  @Expose()
  status: string;

  @Expose()
  created_by: string;

  @Expose()
  board: string;

  @Expose()
  @Type(() => TaskGroupResponse)
  task_group: string | TaskGroupResponse;

  @Expose()
  @Type(() => LabelResponse)
  labels: string[] | LabelResponse[];

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  __v: number;

  constructor(partial: Partial<TaskResponse>) {
    Object.assign(this, partial);
  }
}
