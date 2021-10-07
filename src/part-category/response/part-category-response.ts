import { ObjectId } from 'mongodb';
import { Transform, Expose, Exclude, Type } from 'class-transformer';

@Exclude()
export class PartCategoryResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  name: string;

  @Expose()
  parent: string;

  @Expose()
  image: string;

  @Expose()
  description: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  @Type(() => PartCategoryResponse)
  children: PartCategoryResponse[];

  __v: number;

  constructor(partial: Partial<PartCategoryResponse>) {
    Object.assign(this, partial);
  }
}
