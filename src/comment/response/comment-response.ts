import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose } from 'class-transformer';

@Exclude()
export class CommentResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  content: string;

  @Expose()
  created_by: string;

  @Expose()
  mention_users: string[];

  @Expose()
  attachments: string[];

  @Expose()
  task: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  __v: number;

  constructor(partial: Partial<CommentResponse>) {
    Object.assign(this, partial);
  }
}
