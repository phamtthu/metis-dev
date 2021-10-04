import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export enum TaskStatus {
  Open = 1,
  InProgress = 2,
  Done = 3,
  OnScheduled = 0,
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Task extends mongoose.Document {
  @Prop({ required: true, default: null })
  name: string;

  @Prop({ unique: true, required: true, default: null })
  task_no: string;

  @Prop({ required: true, type: Number, enum: [1, 2, 3], default: 1 })
  priority: number;

  @Prop({ required: true, default: null })
  description: string;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ type: Date, required: true, default: null })
  plan_start_date: Date;

  @Prop({ type: Date, required: true, default: null })
  plan_end_date: Date;

  @Prop({ type: Date, required: true, default: null })
  start_date: Date;

  @Prop({ type: Date, required: true, default: null })
  end_date: Date;

  @Prop({ required: true, default: null })
  plan_start_time: number;

  @Prop({ required: true, default: null })
  plan_end_time: number;

  @Prop({ required: true, default: null })
  start_time: number;

  @Prop({ required: true, default: null })
  end_time: number;

  @Prop({ required: true, default: null })
  extra_time: number;

  @Prop({ required: true, default: null })
  est_time: number;

  @Prop({ required: true, default: null })
  real_time: number;

  @Prop({ required: true, default: null })
  percent: number;

  @Prop({ required: true, default: null })
  comment: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    default: null,
  })
  skill: string;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Label',
        required: true,
      },
    ],
  })
  labels: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task_Status',
    required: true,
    default: null,
  })
  status: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    default: null,
  })
  product: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product_WorkCenter',
    required: true,
    default: null,
  })
  product_workcenter: string;

  // Optional

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null })
  parent: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null })
  pre_task: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null })
  after_task: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.plugin(mongoosePaginate);
