import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class SequenceUser extends mongoose.Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sequence',
    default: null,
  })
  sequence: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
  user: string;
}

export const SequenceUserSchema = SchemaFactory.createForClass(SequenceUser);
SequenceUserSchema.plugin(mongoosePaginate);

SequenceUserSchema.index({ sequence: 1, user: 1 }, { unique: true });
