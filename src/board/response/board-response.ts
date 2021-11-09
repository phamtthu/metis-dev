import { ObjectId } from 'mongodb';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BoardResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  name: string;

  @Expose()
  cover_background: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  over_time: number;

  @Expose()
  working_time: number;

  __v: number;

  constructor(partial: Partial<BoardResponse>) {
    Object.assign(this, partial);
  }
}
