import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { ProductCategoryResponse } from 'src/product-category/response/product-category-response';

@Exclude()
export class ProductResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  name: string;

  @Expose()
  status: number;

  @Expose()
  product_no: string;

  @Expose()
  sku: string;

  @Expose()
  description: string;

  @Expose()
  images: string[];

  @Expose()
  @Type(() => ProductCategoryResponse)
  category: string | ProductCategoryResponse;

  @Expose()
  size: number;

  @Expose()
  weight: number;

  @Expose()
  specification: string;

  @Expose()
  unit: number;

  @Expose()
  unit_cost: number;

  @Expose()
  production_lead_time: number;

  @Expose()
  attributes: string[];

  @Expose()
  creator: string;

  @Expose()
  files: string[];

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  __v: number;

  constructor(partial: Partial<ProductResponse>) {
    Object.assign(this, partial);
  }
}
