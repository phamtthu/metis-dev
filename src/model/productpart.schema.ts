import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate-v2'

export enum ProductPartStatus {
    Broken = 2,
    Ready = 1,
    Fixing = 0
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class ProductPart extends Document {

    @Prop({ required: true, default: null })
    name: string

    @Prop({ required: true, enum: ProductPartStatus })
    status: number

    @Prop({ unique: true, required: true })
    material_no: string

    @Prop({ required: true, type: Types.ObjectId, ref: 'Part_Category', default: null })
    category: string

    @Prop({ default: 0, min: 0, require: true })
    quantity: number

    @Prop({ type: [String], required: true })
    images: string[]

    @Prop({ default: 0, min: 0, require: true })
    unit_cost: number

    @Prop({ default: 0, min: 0, require: true })
    unit_price: number

    @Prop({ required: true, default: null })
    description: string

    // Set By Other

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }] })
    products: string[]

}

export const ProductPartSchema = SchemaFactory.createForClass(ProductPart)
ProductPartSchema.plugin(mongoosePaginate)