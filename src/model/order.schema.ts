import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate-v2'
import { Product } from 'src/order/dto/add-order.dto'

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

export class Order extends Document {

    @Prop({ type: Types.ObjectId, ref: 'Customer' })
    customer: string

    @Prop({ required: true, unique: true })
    po_no: string

    @Prop({ type: Date, required: true, default: null })
    start_date: Date

    @Prop({ type: Date, required: true, default: null })
    date_scheduled: Date

    @Prop({ type: Date, required: true, default: null })
    date_fulfilled: Date

    @Prop({
        required: true,
        type: [{
            _id: false,
            product: { type: Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, min: 0 },
        }]
    })
    products: Product[]

}

export const OrderSchema = SchemaFactory.createForClass(Order)
OrderSchema.plugin(mongoosePaginate)