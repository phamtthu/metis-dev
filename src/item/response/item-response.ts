import { ObjectId } from 'mongodb';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ItemResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  name: string;

  @Expose()
  is_complete: Boolean;

  @Expose()
  index: number;

  @Expose()
  task_checklist: string;

  @Expose()
  created_by: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  __v: number;

  constructor(partial: Partial<ItemResponse>) {
    Object.assign(this, partial);
  }
}
