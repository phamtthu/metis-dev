import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { SequenceSchema } from "./sequence.schema"

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Sequence', schema: SequenceSchema }])],
    exports: [MongooseModule]
})

export class SequenceDatabaseModule { }