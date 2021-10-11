import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose } from 'class-transformer';

@Exclude()
export class SkillResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  name: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  __v: number;

  constructor(partial: Partial<SkillResponse>) {
    Object.assign(this, partial);
  }
}
