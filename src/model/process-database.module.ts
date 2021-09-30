import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ProcessSchema } from "./process.schema"

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Process', schema: ProcessSchema }])],
    exports: [MongooseModule]
})

export class ProcessDatabaseModule { }