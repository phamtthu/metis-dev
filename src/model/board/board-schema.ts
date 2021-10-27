import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { overrideMethods } from 'src/shared/helper';
const mongoose_delete: any = require('mongoose-delete');

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Board extends mongoose.Document {
  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  cover_background: string;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
BoardSchema.plugin(mongoosePaginate);
BoardSchema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: overrideMethods,
});
