import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { PartResponse } from 'src/part/response/part-response';

@Exclude()
export class ProductPartResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  product: string;

  @Expose()
  @Type(() => PartResponse)
  part: string | PartResponse;

  @Expose()
  quantity: number;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  __v: number;

  constructor(partial: Partial<ProductPartResponse>) {
    Object.assign(this, partial);
  }
}
