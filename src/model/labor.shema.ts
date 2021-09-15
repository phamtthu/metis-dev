import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate-v2'
import { Role, Status } from 'src/common/enum/filter.enum'
import { Skill } from 'src/labor/dto/add-labor.dto'

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

export class Labor extends Document {

    @Prop({ required: true, default: null, trim: true, maxLength: 50 })
    name: string

    @Prop({ required: true, default: null, trim: true })
    email: string

    @Prop({ required: true, default: null, unique: true })
    labor_no: string

    @Prop({ required: true, default: null })
    image: string

    @Prop({ default: 0, min: 0, require: true })
    unit_labor_cost: number

    @Prop({ default: 0, min: 0, require: true })
    output_month: number

    @Prop({ default: 0, min: 0, max: 100, require: true })
    efficiency: number

    @Prop({ required: true, default: null, maxLength: 200 })
    note: string

    @Prop({ type: Number, enum: Status, default: Status.InActive })
    is_active: number

    @Prop({
        required: true,
        type: [{
            _id: false,
            skill: { type: Types.ObjectId },
            level: { type: Number, enum: [1, 2, 3, 4, 5] },
        }]
    })
    skills: Skill[]

    @Prop({ required: true, type: Types.ObjectId, ref: 'Position', default: null })
    position: string

    @Prop({ required: true, type: Types.ObjectId, ref: 'WorkCenter', default: null })
    work_center: string /* | WorkCenter */

    @Prop({ type: [String], enum: Role, default: [Role.Employee] })
    roles: string[]

    // Set by Other

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Resource' }] })
    resources: string[]/* Resource[] */

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }] })
    tasks: string[] /* | Tasks[] */

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



