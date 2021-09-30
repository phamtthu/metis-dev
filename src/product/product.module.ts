import { Module } from "@nestjs/common"
import { SkillDatabaseModule } from "src/model/skill-database.module"
import { SharedModule } from "src/shared/shared.module"
import { ProductDatabaseModule } from "src/model/product-database.module"
import { ProductController } from "./product.controller"
import { ProductService } from "./product.service"
import { ProductIDExistenceValidator } from "./custom-validator/productId-existence.validator"
import { TaskDatabaseModule } from "src/model/task-database.module"
import { OrderDatabaseModule } from "src/model/order-database.module"
import { ProductPartDatabaseModule } from "src/model/productpart-database.module"
import { ProductWorkCenterDatabaseModule } from "src/model/productworkcenter-database.module"

@Module({
    imports: [
        ProductDatabaseModule,
        TaskDatabaseModule,
        OrderDatabaseModule,
        ProductPartDatabaseModule,
        ProductWorkCenterDatabaseModule,
        SharedModule
    ],
    controllers: [ProductController],
    providers: [ProductService, ProductIDExistenceValidator],
    exports: [ProductService]
})

export class ProductModule { }
