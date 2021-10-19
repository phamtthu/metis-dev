import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose } from 'class-transformer';

@Exclude()
export class AttachmentResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  name: string;

  @Expose()
  type: number;

  @Expose()
  link: string;

  @Expose()
  download_link: string;

  @Expose()
  size: string;

  @Expose()
  task: string;

  @Expose()
  created_by: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  __v: number;

  constructor(partial: Partial<AttachmentResponse>) {
    Object.assign(this, partial);
  }
}
