import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { PartCategoryResponse } from 'src/part-category/response/part-category-response';

@Exclude()
export class PartResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  name: string;

  @Expose()
  status: number;

  @Expose()
  material_no: string;

  @Expose()
  @Type(() => PartCategoryResponse)
  category: string | PartCategoryResponse;

  @Expose()
  quantity: number;

  @Expose()
  images: string[];

  @Expose()
  unit_cost: number;

  @Expose()
  unit_price: number;

  @Expose()
  description: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  __v: number;

  constructor(partial: Partial<PartResponse>) {
    Object.assign(this, partial);
  }
}
