import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose } from 'class-transformer';

@Exclude()
export class TaskStatusResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  name: string;

  @Expose()
  code: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  __v: number;

  constructor(partial: Partial<TaskStatusResponse>) {
    Object.assign(this, partial);
  }
}
