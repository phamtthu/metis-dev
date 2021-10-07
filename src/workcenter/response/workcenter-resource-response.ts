import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose } from 'class-transformer';

@Exclude()
export class WorkCenterResourceResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  workcenter: string;

  @Expose()
  resource: string;
  
  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  // Exclude
  __v: number;

  constructor(partial: Partial<WorkCenterResourceResponse>) {
    Object.assign(this, partial);
  }
}
