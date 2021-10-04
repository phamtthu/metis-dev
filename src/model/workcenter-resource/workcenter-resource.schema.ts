import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class WorkCenterResource extends mongoose.Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkCenter',
    required: true,
    default: null,
  })
  workcenter: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true,
    default: null,
  })
  resource: string;
}

export const WorkCenterResourceSchema =
  SchemaFactory.createForClass(WorkCenterResource);
WorkCenterResourceSchema.plugin(mongoosePaginate);

WorkCenterResourceSchema.index(
  { workcenter: 1, resource: 1 },
  { unique: true },
);
