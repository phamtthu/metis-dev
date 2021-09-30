import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { TaskUser, TaskUserSchema } from "./taskuser.schema"

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Task_User', schema: TaskUserSchema }])],
    exports: [MongooseModule]
})

export class TaskUserDatabaseModule { }