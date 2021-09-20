import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Status } from 'src/common/enum/filter.enum'

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

export class Position extends Document {

    @Prop({ required: true, default: null })
    name: string

    @Prop({ type: Number, enum: Status, default: Status.InActive })
    is_active: number

}

export const PositionSchema = SchemaFactory.createForClass(Position)