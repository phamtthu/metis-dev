import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { LabelResponse } from 'src/label/response/label-response';
import { TaskGroupResponse } from 'src/task-group/response/task-group-response.dto';
import { Moment } from 'moment';
import { UsersResponse } from 'src/user/response/response/users-response';

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
  plan_start_date: Date | Moment;

  @Expose()
  plan_end_date: Date | Moment;

  @Expose()
  actual_end_date: Date;

  @Expose()
  cover_background: string;

  @Expose()
  index: number;

  @Expose()
  status: string;

  @Expose()
  @Type(() => UsersResponse)
  created_by: string | UsersResponse;

  @Expose()
  board: string;

  @Expose()
  @Type(() => TaskGroupResponse)
  task_group: string | TaskGroupResponse;

  @Expose()
  @Type(() => LabelResponse)
  labels: string[] | LabelResponse[];

  @Expose()
  created_at: Date | Moment;

  @Expose()
  updated_at: Date | Moment;

  __v: number;

  constructor(partial: Partial<TaskResponse>) {
    Object.assign(this, partial);
  }
}
