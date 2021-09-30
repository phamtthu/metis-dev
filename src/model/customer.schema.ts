import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Customer extends Document {
  @Prop({ required: true, default: null, trim: true, maxLength: 50 })
  name: string;

  @Prop({ required: true, unique: true })
  customer_no: string;

  // Other
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Order' }] })
  orders: string[];
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
CustomerSchema.plugin(mongoosePaginate);
