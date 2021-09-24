import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { CustomerSchema } from "./customer.schema"

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }])],
    exports: [MongooseModule]
})

export class CustomerDatabaseModule { }