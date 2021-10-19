import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { LabelResponse } from 'src/label/response/label-response';
import { UserResponse } from 'src/user/response/response/user-response';
import { Moment } from 'moment';
import { prettierDate } from 'src/shared/helper';

@Exclude()
export class SumaryTaskResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  name: string;

  @Expose()
  @Transform(({ value }) => prettierDate(value))
  plan_start_date: Moment;

  @Expose()
  @Transform(({ value }) => prettierDate(value))
  plan_end_date: Date;

  @Expose()
  cover_background: string;

  @Expose()
  index: number;

  @Expose()
  created_by: ObjectId;

  @Expose()
  board: ObjectId;

  @Expose()
  task_group: ObjectId;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  comments: number;

  @Expose()
  task_checklist: string;

  @Expose()
  @Type(() => UserResponse)
  users: UserResponse[];

  @Expose()
  @Type(() => LabelResponse)
  labels: LabelResponse[];

  constructor(partial: Partial<SumaryTaskResponse>) {
    Object.assign(this, partial);
  }
}
