import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class ProductWorkCenter extends mongoose.Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null,
    unique: true,
  })
  product: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkCenter',
    required: true,
    default: null,
  })
  workcenter: string;

  @Prop({ default: null })
  status: number;

  @Prop({ default: null })
  percent: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }] })
  resources: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  users: string[];
}

export const ProductWorkCenterSchema =
  SchemaFactory.createForClass(ProductWorkCenter);
ProductWorkCenterSchema.plugin(mongoosePaginate);

ProductWorkCenterSchema.index({ product: 1, workcenter: 1 }, { unique: true });
