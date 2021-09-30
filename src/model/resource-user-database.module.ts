import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ResourceUserSchema } from "./resource-user.schema"

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Resource_User', schema: ResourceUserSchema }])],
    exports: [MongooseModule]
})

export class ResourceUserDatabaseModule { }