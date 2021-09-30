import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { WorkCenterUserSchema } from "./workcenter-user.schema"

@Module({
    imports: [MongooseModule.forFeature([{ name: 'WorkCenter_User', schema: WorkCenterUserSchema }])],
    exports: [MongooseModule]
})

export class WorkCenterUserDatabaseModule { }