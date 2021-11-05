import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { overrideMethods } from 'src/shared/helper';
const mongoose_delete: any = require('mongoose-delete');

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Report extends mongoose.Document {
  // Test save null
  @Prop({ default: null })
  board: string;

  @Prop({ required: true })
  working_time: number;

  @Prop({ required: true })
  content: string;

  @Prop({ default: null })
  issues: string;

  @Prop({ required: true })
  status: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  })
  created_by: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
ReportSchema.plugin(mongoosePaginate);
ReportSchema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: overrideMethods,
});
