import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LocationDocument = Location & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at',  }, _id: false })
export class Location {
    // @Prop({type: Types.ObjectId})
    //  _id: Types.ObjectId;

    @Prop({ required: true })
    user_id: ObjectId

    @Prop({ required: true })
    name: string

    @Prop({ required: false })
    district: string

    @Prop({ required: false })
    province: string

    @Prop({ required: true })
    lat: number

    @Prop({ required: true })
    long: number

}
export const LocationSchema = SchemaFactory.createForClass(Location);
