import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { PositionResponse } from 'src/position/response/position-response';

@Exclude()
class Skill {
  @Expose()
  _id?: ObjectId;

  @Expose()
  skill: string;

  @Expose()
  level: string;

  constructor(partial: Partial<Skill>) {
    Object.assign(this, partial);
  }
}

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
  status: number;

  @Expose()
  note: string;

  @Expose()
  output: number;

  @Expose()
  efficiency: number;

  @Expose()
  @Type(() => PositionResponse)
  position: string | PositionResponse;

  @Expose()
  @Type(() => Skill)
  skills: Skill[];

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
