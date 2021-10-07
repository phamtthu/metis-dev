import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose } from 'class-transformer';

@Exclude()
export class ProductWorkCenterResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  product: string;

  @Expose()
  workcenter: string;

  @Expose()
  status: number;

  @Expose()
  percent: number;

  @Expose()
  resources: string[];

  @Expose()
  users: string[];

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  __v: number;

  constructor(partial: Partial<ProductWorkCenterResponse>) {
    Object.assign(this, partial);
  }
}
