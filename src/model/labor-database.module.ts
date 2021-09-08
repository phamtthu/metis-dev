import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { LaborSchema } from "./labor.shema"

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Labor', schema: LaborSchema }])],
    exports: [MongooseModule]
})

export class LaborDatabaseModule { }
