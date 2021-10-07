import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { ResourceCategoryResponse } from 'src/resource-category/response/resource-category-response';
@Exclude()
export class ResourceResponse {
  @Expose()
  _id: ObjectId;

  @Expose()
  equipment_name: string;

  @Expose()
  equipment_no: string;

  @Expose()
  status: number;

  @Expose()
  category: string | ResourceCategoryResponse;

  @Expose()
  capacity: number;

  @Expose()
  description: string;

  @Expose()
  images: string[];

  @Expose()
  serial_no: string;

  @Expose()
  supplier_vendor: string;

  @Expose()
  specification: string;

  @Expose()
  work_instruction: string;

  @Expose()
  unit_cost: number;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  // Exclude

  __v: number;

  constructor(partial: Partial<ResourceResponse>) {
    Object.assign(this, partial);
  }
}
