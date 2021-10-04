import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export enum SequenceConstraint {
  StartToStart = 0,
  StartToFinish = 1,
  FinishToFinish = 2,
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Sequence extends mongoose.Document {
  @Prop({ required: true, default: null, unique: true })
  name: string;

  @Prop({ required: true, type: Number, default: null })
  position_x: number;

  @Prop({ required: true, type: Number, default: null })
  position_y: number;

  @Prop({ required: true, type: Number, default: null })
  size_w: number;

  @Prop({ required: true, type: Number, default: null })
  size_h: number;

  @Prop({ required: true, type: Date, default: null })
  start_date: Date;

  @Prop({ required: true, type: Date, default: null })
  end_date: Date;

  @Prop({ required: true, type: String, default: null })
  title_color: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Process',
    default: null,
  })
  process: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sequence',
    default: null,
  })
  parent: string;

  @Prop({ type: Number, enum: SequenceConstraint, default: null })
  constraint: number;
}

export const SequenceSchema = SchemaFactory.createForClass(Sequence);
SequenceSchema.plugin(mongoosePaginate);
