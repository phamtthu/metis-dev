import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Label extends mongoose.Document {
  @Prop({ required: true, unique: true, trim: true, maxLength: 50 })
  name: string;
}

export const LabelSchema = SchemaFactory.createForClass(Label);
LabelSchema.plugin(mongoosePaginate);
