import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Status } from 'src/common/enum/filter.enum';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class ProductCategory extends mongoose.Document {
  @Prop({ required: true, default: null })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product_Category',
    default: null,
  })
  parent: string;

  @Prop({ required: true, default: null })
  image: string;

  @Prop({ required: true, default: null })
  description: string;
}

export const ProductCategorySchema =
  SchemaFactory.createForClass(ProductCategory);
ProductCategorySchema.plugin(mongoosePaginate);
