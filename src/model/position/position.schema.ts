import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Position extends mongoose.Document {
  @Prop({ required: true, default: null })
  name: string;
}

export const PositionSchema = SchemaFactory.createForClass(Position);
PositionSchema.plugin(mongoosePaginate);
