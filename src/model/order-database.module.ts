import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { OrderSchema } from "./order.schema"

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }])],
    exports: [MongooseModule]
})

export class OrderDatabaseModule { }
