import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class OrderProduct extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null })
  order: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null,
  })
  product: string;

  @Prop({ require: true, default: 0, min: 0, type: Number })
  quantity: number;
}

export const OrderProductSchema = SchemaFactory.createForClass(OrderProduct);
OrderProductSchema.plugin(mongoosePaginate);

OrderProductSchema.index({ order: 1, product: 1 }, { unique: true });
