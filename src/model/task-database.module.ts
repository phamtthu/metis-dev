import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { TaskSchema } from "./task.schema"
import { WorkCenterSchema } from "./workcenter.schema"

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }])],
    exports: [MongooseModule]
})

export class TaskDatabaseModule { }
