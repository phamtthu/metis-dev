import { Module } from "@nestjs/common"
import { SharedModule } from "src/shared/shared.module"
import { ProductDatabaseModule } from "src/model/product-database.module"
import { OrderService } from "./order.service"
import { OrderController } from "./order.controller"
import { OrderDatabaseModule } from "src/model/order-database.module"
import { CustomerDatabaseModule } from "src/model/customer-database.module"

@Module({
    imports: [
        OrderDatabaseModule,
        ProductDatabaseModule,
        CustomerDatabaseModule,
        SharedModule
    ],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [OrderService]
})

export class OrderModule { }
