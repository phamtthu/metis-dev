import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class WorkCenterUser extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'WorkCenter',
    required: true,
    default: null,
  })
  workcenter: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, default: null })
  user: string;
}

export const WorkCenterUserSchema =
  SchemaFactory.createForClass(WorkCenterUser);
WorkCenterUserSchema.plugin(mongoosePaginate);

WorkCenterUserSchema.index({ workcenter: 1, user: 1 }, { unique: true });
