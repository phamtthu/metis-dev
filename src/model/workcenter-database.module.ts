import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { WorkCenterSchema } from "./workcenter.schema"

@Module({
    imports: [MongooseModule.forFeature([{ name: 'WorkCenter', schema: WorkCenterSchema }])],
    exports: [MongooseModule]
})

export class WorkCenterDatabaseModule { }
