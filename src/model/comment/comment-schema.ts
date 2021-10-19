import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { overrideMethods } from 'src/shared/helper';
const mongoose_delete: any = require('mongoose-delete');

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Comment extends mongoose.Document {
  @Prop({ default: null })
  content: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  created_by: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
  })
  mention_users: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  })
  task: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.plugin(mongoosePaginate);

CommentSchema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: overrideMethods,
});

