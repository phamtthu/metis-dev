import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export enum PartStatus {
  Broken = 2,
  Ready = 1,
  Fixing = 0,
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Part extends mongoose.Document {
  @Prop({ required: true, default: null })
  name: string;

  @Prop({ required: true, enum: PartStatus })
  status: number;

  @Prop({ unique: true, required: true })
  material_no: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Part_Category',
    default: null,
  })
  category: string;

  @Prop({ default: 0, min: 0, require: true })
  quantity: number;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ default: 0, min: 0, require: true })
  unit_cost: number;

  @Prop({ required: true, default: null })
  description: string;
}

export const PartSchema = SchemaFactory.createForClass(Part);
PartSchema.plugin(mongoosePaginate);
