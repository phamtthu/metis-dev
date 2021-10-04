import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class TaskUser extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
  user: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null })
  task: string;

  @Prop({ default: null })
  status: string;

  @Prop({ default: null })
  note: string;

  @Prop({ default: null, min: 0 })
  time: number;
}

export const TaskUserSchema = SchemaFactory.createForClass(TaskUser);
TaskUserSchema.plugin(mongoosePaginate);

TaskUserSchema.index({ task: 1, user: 1 }, { unique: true });
