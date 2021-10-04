import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Order extends mongoose.Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    default: null,
  })
  customer: string;

  @Prop({ required: true, unique: true })
  po_no: string;

  @Prop({ type: Date, required: true, default: null })
  start_date: Date;

  @Prop({ type: Date, required: true, default: null })
  date_scheduled: Date;

  @Prop({ type: Date, required: true, default: null })
  date_fulfilled: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.plugin(mongoosePaginate);
// OrderSchema.plugin(aggregatePaginate)
