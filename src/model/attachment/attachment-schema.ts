import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { overrideMethods } from 'src/shared/helper';
const mongoose_delete: any = require('mongoose-delete');

export enum AttachmentTypes {
  Upload = 0,
  GoogleDrive = 1,
  Dropbox = 2,
  OneDrive = 3,
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Attachment extends mongoose.Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Number, emum: AttachmentTypes, required: true })
  type: number;

  @Prop({ default: null })
  link: string;

  @Prop({ default: null })
  download_link: string;

  @Prop({ default: null })
  size: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  })
  task: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  created_by: string;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
AttachmentSchema.plugin(mongoosePaginate);

AttachmentSchema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: overrideMethods,
});
