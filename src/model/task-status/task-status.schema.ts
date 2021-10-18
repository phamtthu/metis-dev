import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { overrideMethods } from 'src/shared/helper';
const mongoose_delete: any = require('mongoose-delete');

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class TaskStatus extends mongoose.Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  code: string;
}

export const TaskStatusSchema = SchemaFactory.createForClass(TaskStatus);
TaskStatusSchema.plugin(mongoosePaginate);
TaskStatusSchema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: overrideMethods,
});
