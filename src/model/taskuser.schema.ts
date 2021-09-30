import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate-v2'

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class TaskUser extends Document {

    @Prop({ type: Types.ObjectId, ref: 'User', default: null })
    user: string

    @Prop({ type: Types.ObjectId, ref: 'Task', default: null })
    task: string

    @Prop({ default: null })
    status: string

    @Prop({ default: null })
    note: string

    @Prop({ default: null, min: 0 })
    time: number

}

export const TaskUserSchema = SchemaFactory.createForClass(TaskUser)
TaskUserSchema.plugin(mongoosePaginate)