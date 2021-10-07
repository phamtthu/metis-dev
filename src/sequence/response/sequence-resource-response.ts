import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose } from 'class-transformer';

@Exclude()
export class SequenceResourceResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  sequence: string;

  @Expose()
  resource: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  __v: number;

  constructor(partial: Partial<SequenceResourceResponse>) {
    Object.assign(this, partial);
  }
}
