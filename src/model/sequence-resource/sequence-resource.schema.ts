import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class SequenceResource extends mongoose.Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sequence',
    default: null,
  })
  sequence: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    default: null,
  })
  resource: string;
}

export const SequenceResourceSchema =
  SchemaFactory.createForClass(SequenceResource);
SequenceResourceSchema.plugin(mongoosePaginate);
