import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose } from 'class-transformer';

@Exclude()
export class TaskUserResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  task: string;

  @Expose()
  user: string;

  @Expose()
  status: string;

  @Expose()
  note: string;

  @Expose()
  time: number;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  // Exclude
  __v: number;

  constructor(partial: Partial<TaskUserResponse>) {
    Object.assign(this, partial);
  }
}
