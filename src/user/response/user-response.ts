import { Exclude, Transform, Expose } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class UserResponse {
  @Exclude()
  __v: any;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}
