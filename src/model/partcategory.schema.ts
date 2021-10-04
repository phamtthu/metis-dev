import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Status } from 'src/common/enum/filter.enum';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class PartCategory extends Document {
  @Prop({ required: true, default: null })
  name: string;

  // @Prop({ type: Number, enum: Status, default: Status.InActive })
  // is_active: number

  @Prop({ type: Types.ObjectId, ref: 'Part_Category', default: null })
  parent: string;

  @Prop({ required: true, default: null })
  image: string;

  @Prop({ required: true, default: null })
  description: string;
}

export const PartCategorySchema = SchemaFactory.createForClass(PartCategory);
PartCategorySchema.plugin(mongoosePaginate);