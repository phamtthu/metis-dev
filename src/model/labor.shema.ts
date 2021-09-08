/* eslint-disable prettier/prettier */

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate-v2'
import { Resource } from 'src/model/resource.shema'

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

export class Labor extends Document {

    @Prop({ required: true, default: null })
    name: string

    @Prop({ required: true, default: null })
    labor_no: string

    @Prop({ required: true, default: null })
    title: string

    @Prop({ required: true, default: null })
    work_center: string

    @Prop({ required: true, default: null })
    skill: string

    @Prop({ required: true, default: null })
    avatar: string

    @Prop({ default: 0, min: 0, require: true })
    unit_labor_cost: number

    @Prop({ default: 0, min: 0, require: true })
    output: number

    @Prop({ default: 0, min: 0, max: 100, require: true })
    efficiency: number

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Resource' }] })
    resources: Resource[]
    // 1 Labor : Many Resource[]

    //----------------------------------------------------------------

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

export const LaborSchema = SchemaFactory.createForClass(Labor)
LaborSchema.plugin(mongoosePaginate)



