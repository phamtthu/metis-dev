import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';
import { Role, Status } from 'src/common/enum/filter.enum';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User extends Document {
  @Prop({ default: null })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ type: Number, enum: Status, default: Status.Active })
  is_active: number;

  @Prop({ required: true, default: null })
  user_no: string;

  @Prop({ required: true, default: null })
  title: string;

  @Prop({ required: true, default: null })
  group_level: number;

  @Prop({ required: true, default: null })
  department: string;

  @Prop({ require: true, default: null })
  image: string;

  @Prop({ required: true, default: null })
  cost_per_hour: number;

  @Prop({ type: Boolean, default: false, required: true })
  is_parttime: boolean;

  @Prop({
    type: [String],
    enum: [Role.Admin, Role.Employee],
    default: [Role.Employee],
  })
  roles: string[];

  @Prop({ type: Array, default: [] })
  device_token: Array<string>;

  @Prop({ type: Date, default: Date.parse('2020-01-01T14:24:04.374+0000') })
  last_connect: Date;

  @Prop({ type: Number, default: 0 })
  today_connect_count: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(mongoosePaginate);
