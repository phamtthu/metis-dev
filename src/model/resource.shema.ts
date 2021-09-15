import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate-v2'

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

    @Prop({ unique: true, required: true })
    resource_no: string

    @Prop({ required: true, type: Types.ObjectId, ref: 'ResourceCategory', default: null})
    category: string

    @Prop({ required: true, default: null })
    description: string

    @Prop({ type: [String], required: true })
    images: string[]

    @Prop({ default: 0, min: 0, require: true })
    work_hours: number

    @Prop({ required: true, type: Types.ObjectId, ref: 'WorkCenter', default: null })
    work_center: string /* | WorkCenter */

    @Prop({ default: 0, min: 0, require: true })
    unit_cost: number

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Labor' }] })
    labors: string[]

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



