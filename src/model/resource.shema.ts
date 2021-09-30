import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export enum ResourceStatus {
  Ready = 1,
  Waiting = 0,
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Resource extends Document {
  @Prop({ required: true, default: null })
  equipment_name: string;

  @Prop({ unique: true, required: true })
  equipment_no: string;

  @Prop({ required: true, default: ResourceStatus.Ready, enum: ResourceStatus })
  status: number;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Resource_Category',
    default: null,
  })
  category: string;

  @Prop({ default: 0, min: 0, require: true })
  capacity: number;

  @Prop({ required: true, default: null })
  description: string;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ required: true, default: null })
  serial_no: string;

  @Prop({ required: true, default: null })
  supplier_vendor: string;

  @Prop({ required: true, default: null })
  specification: string;

  @Prop({ required: true, default: null })
  work_instruction: string;

  @Prop({ required: true, default: null })
  unit_cost: number;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);
ResourceSchema.plugin(mongoosePaginate);
