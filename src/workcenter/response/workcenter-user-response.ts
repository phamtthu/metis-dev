import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose } from 'class-transformer';

@Exclude()
export class WorkCenterUserResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  workcenter: string;

  @Expose()
  user: string;
  
  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  // Exclude
  __v: number;

  constructor(partial: Partial<WorkCenterUserResponse>) {
    Object.assign(this, partial);
  }
}
