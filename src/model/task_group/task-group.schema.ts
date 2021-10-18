import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { overrideMethods } from 'src/shared/helper';
const mongoose_delete: any = require('mongoose-delete');

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class TaskGroup extends mongoose.Document {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ default: null })
  cover_background: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
  })
  board: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task_Status',
    required: true,
  })
  status: string;
}

export const TaskGroupSchema = SchemaFactory.createForClass(TaskGroup);
TaskGroupSchema.plugin(mongoosePaginate);

TaskGroupSchema.index({ status: 1, board: 1 }, { unique: true });
TaskGroupSchema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: overrideMethods,
});
