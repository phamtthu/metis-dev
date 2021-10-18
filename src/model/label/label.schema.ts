import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { overrideMethods } from 'src/shared/helper';
const mongoose_delete: any = require('mongoose-delete');

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Label extends mongoose.Document {
  @Prop({ required: true, unique: true, trim: true, maxLength: 50 })
  name: string;

  @Prop({ default: null })
  cover_background: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
  })
  board: string;
}

export const LabelSchema = SchemaFactory.createForClass(Label);
LabelSchema.plugin(mongoosePaginate);
LabelSchema.index({ name: 1, board: 1 }, { unique: true });
LabelSchema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: overrideMethods,
});
