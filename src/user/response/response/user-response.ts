import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose } from 'class-transformer';

@Exclude()
export class UserResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  name: string;

  @Expose()
  tag_name: string;

  @Expose()
  email: string;

  @Expose()
  is_active: number;

  @Expose()
  user_no: string;

  @Expose()
  title: string;

  @Expose()
  group_level: number;

  @Expose()
  department: string;

  @Expose()
  image: string;

  @Expose()
  cost_per_hour: number;

  @Expose()
  is_parttime: Boolean;

  @Expose()
  roles: string[];

  @Expose()
  device_token: Array<string>;

  @Expose()
  last_connect: Date;

  @Expose()
  today_connect_count: Number;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  password: string;
  __v: number;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}
