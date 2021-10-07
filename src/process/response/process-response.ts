import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose } from 'class-transformer';

@Exclude()
export class ProcessResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  name: string;

  @Expose()
  process_no: string;

  @Expose()
  description: string;

  @Expose()
  attributes: string[];

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  __v: number;

  constructor(partial: Partial<ProcessResponse>) {
    Object.assign(this, partial);
  }
}
