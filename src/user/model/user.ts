import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Location, LocationSchema } from "./location";
import DateTimeFormat = Intl.DateTimeFormat;
export type UserDocument = User & Document;
export enum UserStatus {
  "ACTIVE" = 1,
  "INACTIVE" = 2

}

export enum UserType {
  "USER" = 1,
  "BROKER" = 2
}

export enum ConnectorType {
  "SELL_BROKER" = 1,
  "BUY_BROKER" = 2,
  "ALL_BROKER" = 3
}

export enum ApproveStatus {
  AWAIT = 0,
  APPROVE = 1,
  UPDATED = 2

}
@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User {

  _id: Number

  @Prop({ required: true })
  name: string

  @Prop({ type: String, default: '' })
  avatar: string

  @Prop({ required: true })
  phone: string

  @Prop({ required: true })
  password: string

  @Prop({ type: String, default: '' })
  email: string

  @Prop({ type: Date, default: '' })
  birthday: Date

  @Prop({ type: String, default: '' })
  address: string

  @Prop({ type: Number, enum: UserType, default: UserType.USER })
  user_type: number

  @Prop({ type: Number, enum: ConnectorType, default: ConnectorType.ALL_BROKER })
  connector_type: number

  @Prop({ type: String, default: '' })
  verify_code: string

  @Prop({ type: String, default: '' })
  change_code: string

  @Prop({ type: Date, default: Date.now })
  regist_date: Date

  @Prop({ type: Date })
  last_login: Date

  @Prop({ type: String, default: '' })
  introduction: String

  @Prop({ type: Number, default: 0 })
  star: Number

  @Prop({ type: Number, enum: UserStatus, default: UserStatus.ACTIVE })
  status: Number

  @Prop({ type: Number, default: 0 })
  num_connect: Number

  @Prop({ type: Number, default: 0 })
  num_ratting: Number

  @Prop({ type: Array, default: [] })
  id_card_image: Array<Object>

  @Prop({ type: Array, default: [] })
  portrait_image: Array<Object>

  @Prop({ type: Array, default: [] })
  certicate_image: Array<String>

  @Prop({ type: Array, default: [] })
  device_token: Array<string>

  @Prop({ type: Date, default: '' })
  time_change_pass: Date

  @Prop({ type: String, default: '', max: 4 })
  country_code: string;

  @Prop({ type: String, default: '', max: 4 })
  dial_code: string;

  @Prop({ type: Number, enum: ApproveStatus, default: ApproveStatus.AWAIT })
  approve_status: Number;

  @Prop({ type: Boolean, default: false })
  verify_sms: boolean;

  @Prop({ type: Boolean, default: false })
  auto_accept_connect: boolean

  @Prop({ type: Date, default: Date.parse('2020-01-01T14:24:04.374+0000') })
  last_connect: Date

  @Prop({ type: Number, default: 0 })
  today_connect_count: Number

  @Prop({ type: Number, default: 0 })
  num_save_news: Number

}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ name: 'text', phone: 'text' });