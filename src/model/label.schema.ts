import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Label extends Document {
  @Prop({ required: true, unique: true, trim: true, maxLength: 50 })
  name: string;

  // // // Test
  // @Prop({ type: Date })
  // date: Date
}

export const LabelSchema = SchemaFactory.createForClass(Label);
LabelSchema.plugin(mongoosePaginate);
