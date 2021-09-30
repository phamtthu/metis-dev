import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Status } from 'src/common/enum/filter.enum'
import * as mongoosePaginate from 'mongoose-paginate-v2'

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

export class TaskStatus extends Document {

    // Tên trạng thái 
    @Prop({ required: true, default: null })
    name: string

    @Prop({ required: true, default: null })
    code: string

}

export const TaskStatusSchema = SchemaFactory.createForClass(TaskStatus)
TaskStatusSchema.plugin(mongoosePaginate)