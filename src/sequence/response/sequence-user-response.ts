import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose } from 'class-transformer';

@Exclude()
export class SequenceUserResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  sequence: string;

  @Expose()
  user: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  __v: number;

  constructor(partial: Partial<SequenceUserResponse>) {
    Object.assign(this, partial);
  }
}
