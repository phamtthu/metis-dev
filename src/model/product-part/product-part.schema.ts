import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class ProductPart extends mongoose.Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null,
    required: true,
  })
  product: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Part',
    default: null,
  })
  part: string;

  @Prop({ required: true, default: null })
  quantity: number;
}

export const ProductPartSchema = SchemaFactory.createForClass(ProductPart);
ProductPartSchema.plugin(mongoosePaginate);
