import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose } from 'class-transformer';

@Exclude()
export class ReportResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  board: string;

  @Expose()
  working_time: number;

  @Expose()
  content: string;

  @Expose()
  issues: string;

  @Expose()
  status: string;

  @Expose()
  created_by: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  __v: number;

  constructor(partial: Partial<ReportResponse>) {
    Object.assign(this, partial);
  }
}
