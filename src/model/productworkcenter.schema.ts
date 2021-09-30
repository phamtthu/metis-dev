import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate-v2'

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

export class ProductWorkCenter extends Document {

    @Prop({ type: Types.ObjectId, ref: 'Product', required: true, default: null, unique: true})
    product: string

    @Prop({ type: Types.ObjectId, ref: 'WorkCenter', required: true, default: null })
    work_center: string

    @Prop({ default: null })
    status: string

    @Prop({ default: null })
    percent: number

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Resource' }] })
    resources: string[]

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
    users: string[]

}

export const ProductWorkCenterSchema = SchemaFactory.createForClass(ProductWorkCenter)
ProductWorkCenterSchema.plugin(mongoosePaginate)