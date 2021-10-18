import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose } from 'class-transformer';

@Exclude()
export class TaskGroupResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  name: string;

  @Expose()
  cover_background: string;

  @Expose()
  board: string;

  @Expose()
  status: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  __v: number;

  constructor(partial: Partial<TaskGroupResponse>) {
    Object.assign(this, partial);
  }
}
