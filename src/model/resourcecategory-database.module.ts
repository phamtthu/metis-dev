import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ResourceCategorySchema } from "./resourcecategory.schema"

@Module({
    imports: [MongooseModule.forFeature([{ name: 'ResourceCategory', schema: ResourceCategorySchema }])],
    exports: [MongooseModule]
})

export class ResourceCategoryDatabaseModule { }