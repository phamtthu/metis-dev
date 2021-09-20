import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { PositionSchema } from "./position.schema"

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Position', schema: PositionSchema }])],
    exports: [MongooseModule]
})

export class PositionDatabaseModule { }