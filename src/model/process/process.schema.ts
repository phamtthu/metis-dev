import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Status } from 'src/common/enum/filter.enum';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Process extends mongoose.Document {
  @Prop({ required: true, default: null })
  name: string;

  @Prop({ required: true, unique: true })
  process_no: string;

  @Prop({ required: true, default: null })
  description: string;

  @Prop({ type: [String], required: true })
  attributes: string[];
}

export const ProcessSchema = SchemaFactory.createForClass(Process);
ProcessSchema.plugin(mongoosePaginate);
