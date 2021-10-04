import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class ResourceUser extends mongoose.Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true,
    default: null,
  })
  resource: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    default: null,
  })
  user: string;
}

export const ResourceUserSchema = SchemaFactory.createForClass(ResourceUser);
ResourceUserSchema.plugin(mongoosePaginate);

ResourceUserSchema.index({ resource: 1, user: 1 }, { unique: true });
