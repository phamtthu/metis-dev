/* eslint-disable prettier/prettier */

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate-v2'
import { Labor } from 'src/model/labor.shema'

enum Status {
    Ready = 1,
    Waiting = 0
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Resource extends Document {

    @Prop({ required: true, default: null })
    equipment_name: string

    @Prop({ required: true, default: Status.Waiting, enum: Status })
    status: number

    @Prop({ required: true, default: null })
    number: string

    @Prop({ required: true, default: null })
    category: string

    @Prop({ required: true, default: 0, min: 0, max: 100 })
    capacity: number

    @Prop({ required: true, default: null })
    description: string

    @Prop({ type: [String], required: true })
    images: string[]

    @Prop({ required: true, default: null })
    serial_no: string

    @Prop({ required: true, default: null })
    supplier_vendor: string

    @Prop({ required: true, default: null })
    specification: string

    @Prop({ required: true, default: 0, min: 0 })
    work_instruction: number

    @Prop({ required: true, default: null })
    work_center: string

    @Prop({ default: 0, min: 0, require: true })
    unit_cost: number

    @Prop({ default: 0, min: 0, require: true })
    output: number

    @Prop({ default: 0, min: 0, max: 100, require: true })
    efficiency: number

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Labor' }] })
    labors: Labor[]

    // @Prop({ default: 0 })
    // number_of_rating: number

    //   @Prop({ required: true, default: null })
    // deal_link: string

    //   @Prop({ required: true, default: null })
    // shipping_infor: string

    // @Prop({ type: Types.ObjectId, ref: 'Brand' })
    // brand: string
    // // 1 Product : 1 Brand

    // @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }] })
    // categories: string[]
    // //categories: Category[]
    // // 1 Product : Many Category[]

    // @Prop({ type: Types.ObjectId, ref: 'Store' })
    // store: string
    // // 1 Product: 1 Store

    // @Prop({ type: Types.ObjectId, ref: 'User' })
    // created_by: string

    // @Prop({ type: Number, default: 0 })
    // view: number

    // @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
    // like: string[]

}

export const ResourceSchema = SchemaFactory.createForClass(Resource)
ResourceSchema.plugin(mongoosePaginate)



