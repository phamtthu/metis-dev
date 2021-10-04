import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class TaskStatus extends mongoose.Document {
  @Prop({ required: true, default: null })
  name: string;

  @Prop({ required: true, default: null })
  code: string;
}

export const TaskStatusSchema = SchemaFactory.createForClass(TaskStatus);
TaskStatusSchema.plugin(mongoosePaginate);
