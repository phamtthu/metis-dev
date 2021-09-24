import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate-v2'

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

export class WorkCenter extends Document {

    @Prop({ required: true, default: null })
    name: string

    @Prop({ required: true, unique: true })
    work_center_no: string

    @Prop({ required: true, default: null })
    description: string

    @Prop({ required: true, default: null, min: 0 })
    estimated_mhs: number

    @Prop({ required: true, default: null, min: 0 })
    avg_mhs: number

    @Prop({ required: true, default: null, min: 0 })
    total_mhs: number

    @Prop({ required: true, default: null, min: 0 })
    output: number

    @Prop({ required: true, default: null, min: 0 })
    actual: number

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Labor' }] })
    labors: string[]

    // -- Other

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Resource' }] })
    resources: string[]
}

export const WorkCenterSchema = SchemaFactory.createForClass(WorkCenter)
WorkCenterSchema.plugin(mongoosePaginate)