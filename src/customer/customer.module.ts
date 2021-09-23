import { Module } from "@nestjs/common"
import { CustomerDatabaseModule } from "src/model/customer-database.module"
import { OrderDatabaseModule } from "src/model/order-database.module"
import { SharedModule } from "src/shared/shared.module"
import { CustomerIDExistenceValidator } from "./custom-validator/customerId.validator"
import { CustomerController } from "./customer.controller"
import { CustomerService } from "./customer.service"


@Module({
    imports: [
        CustomerDatabaseModule,
        OrderDatabaseModule,
        SharedModule
    ],
    controllers: [CustomerController],
    providers: [CustomerService, CustomerIDExistenceValidator],
    exports: [CustomerService]
})

export class CustomerModule { }