import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ResourceSchema } from "./resource.shema"

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Resource', schema: ResourceSchema }])],
    exports: [MongooseModule]
})

export class ResourceDatabaseModule { }
