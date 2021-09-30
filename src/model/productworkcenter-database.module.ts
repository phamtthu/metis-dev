import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ProductWorkCenterSchema } from "./productworkcenter.schema"

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Product_Work_Center', schema: ProductWorkCenterSchema }])],
    exports: [MongooseModule]
})

export class ProductWorkCenterDatabaseModule { }
