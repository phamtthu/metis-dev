import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { ItemResponse } from 'src/item/response/item-response';

@Exclude()
export class TaskChecklistResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  name: string;

  @Expose()
  is_complete: Boolean;

  @Expose()
  index: number;

  @Expose()
  task: string;

  @Expose()
  created_by: string;

  @Expose()
  @Type(() => ItemResponse)
  items: ItemResponse[];

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  __v: number;

  constructor(partial: Partial<TaskChecklistResponse>) {
    Object.assign(this, partial);
  }
}
