import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { overrideMethods } from 'src/shared/helper';
const mongoose_delete: any = require('mongoose-delete');

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Item extends mongoose.Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Boolean, default: false })
  is_complete: Boolean;

  @Prop({ default: null })
  index: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task_Checklist',
    required: true,
  })
  task_checklist: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  created_by: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
ItemSchema.plugin(mongoosePaginate);
ItemSchema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: overrideMethods,
});
