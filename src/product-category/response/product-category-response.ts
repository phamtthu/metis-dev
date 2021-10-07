import { ObjectId } from 'mongodb';
import { Transform, Expose, Exclude, Type } from 'class-transformer';

@Exclude()
export class ProductCategoryResponse {
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
  @Type(() => ProductCategoryResponse)
  children: ProductCategoryResponse[];

  __v: number;

  constructor(partial: Partial<ProductCategoryResponse>) {
    Object.assign(this, partial);
  }
}
