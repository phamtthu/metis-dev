import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import * as mongoose from 'mongoose';
import { Role, Status } from 'src/common/enum/filter.enum';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User extends mongoose.Document {
  @Prop({ default: null })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Number, enum: Status, default: Status.Active })
  is_active: number;

  @Prop({ default: null })
  user_no: string;

  @Prop({ default: null })
  title: string;

  @Prop({ default: null })
  group_level: number;

  @Prop({ default: null })
  department: string;

  @Prop({ require: true, default: null })
  image: string;

  @Prop({ default: null })
  cost_per_hour: number;

  @Prop({ type: Boolean, default: false })
  is_parttime: Boolean;

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
  today_connect_count: Number;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(mongoosePaginate);
