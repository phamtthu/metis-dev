import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { overrideMethods } from 'src/shared/helper';
const mongoose_delete: any = require('mongoose-delete');

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

  @Prop({ type: Date, required: true, default: null })
  plan_start_date: Date;

  @Prop({ type: Date, required: true, default: null })
  plan_end_date: Date;

  @Prop({ default: null })
  cover_background: string;

  @Prop({ default: null })
  index: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  created_by: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
  })
  board: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task_Group',
    required: true,
  })
  task_group: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Label',
    required: true,
  })
  labels: string[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.plugin(mongoosePaginate);
TaskSchema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: overrideMethods,
});
