import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export enum ProductStatus {
  Pending = 0,
  Ready = 1,
  Inprogress = 2,
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Product extends mongoose.Document {
  @Prop({ required: true, default: null })
  name: string;

  @Prop({
    required: true,
    default: ProductStatus.Pending,
    enum: ProductStatus,
  })
  status: number;

  @Prop({ unique: true, required: true })
  product_no: string;

  @Prop({ unique: true, required: true })
  sku: string;

  @Prop({ required: true, default: null })
  description: string;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product_Category',
    default: null,
  })
  category: string;

  @Prop({ default: 0, min: 0, require: true })
  size: number;

  @Prop({ default: 0, min: 0, require: true })
  weight: number;

  @Prop({ unique: true, required: true })
  specification: string;

  @Prop({ default: 0, min: 0, require: true })
  unit: number;

  @Prop({ default: 0, min: 0, require: true })
  unit_cost: number;

  @Prop({ default: 0, min: 0, require: true })
  production_lead_time: number;

  @Prop({ type: [String], required: true })
  attributes: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  })
  creator: string;

  @Prop({ type: [String] })
  files: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.plugin(mongoosePaginate);
