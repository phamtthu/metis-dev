import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class WorkCenter extends Document {
  @Prop({ required: true, default: null })
  name: string;

  @Prop({ required: true, unique: true })
  workcenter_no: string;

  @Prop({ required: true, default: null, min: 0 })
  avg_working_hours: number;

  @Prop({ required: true, default: null, min: 0 })
  avg_labor_cost: number;

  @Prop({ required: true, default: null, min: 0 })
  avg_output: number;

  @Prop({ required: true, default: null, min: 0 })
  time_before_production: number;

  @Prop({ required: true, default: null })
  description: string;

  @Prop({ required: true, default: null, min: 0 })
  estimated_mhs: number;

  @Prop({ required: true, default: null, min: 0 })
  avg_mhs: number;

  @Prop({ required: true, default: null, min: 0 })
  total_mhs: number;

  @Prop({ required: true, default: null, min: 0 })
  out_mtd: number;

  @Prop({ required: true, default: null, min: 0 })
  eff_mtd: number;

  @Prop({ required: true, default: null, min: 0 })
  o_target: number;

  @Prop({ required: true, default: null, min: 0 })
  output: number;

  @Prop({ required: true, default: null, min: 0 })
  target: number;

  @Prop({ required: true, default: null, min: 0 })
  actual: number;
}

export const WorkCenterSchema = SchemaFactory.createForClass(WorkCenter);
WorkCenterSchema.plugin(mongoosePaginate);
