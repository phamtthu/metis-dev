import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose } from 'class-transformer';
import { ProcessResponse } from 'src/process/response/process-response';

@Exclude()
export class SequenceResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  name: string;

  @Expose()
  position_x: number;

  @Expose()
  position_y: number;

  @Expose()
  size_w: number;

  @Expose()
  size_h: number;

  @Expose()
  start_date: Date;

  @Expose()
  end_date: Date;

  @Expose()
  title_color: string;

  @Expose()
  process: string | ProcessResponse;

  @Expose()
  parent: string;

  @Expose()
  constraint: number;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  children: SequenceResponse[];

  __v: number;

  constructor(partial: Partial<SequenceResponse>) {
    Object.assign(this, partial);
  }
}
