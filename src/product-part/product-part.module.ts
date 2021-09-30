import { Module } from "@nestjs/common"
import { ProductDatabaseModule } from "src/model/product-database.module"
import { ProductPartDatabaseModule } from "src/model/productpart-database.module"


import { SharedModule } from "src/shared/shared.module"
import { ProductPartIDsExistenceValidator } from "./custom-validator/product-partIds-exitence.validator"
import { ProductPartController } from "./product-part.controller"
import { ProductPartService } from "./product-part.service"

@Module({
    imports: [
        ProductPartDatabaseModule,
        ProductDatabaseModule,
        SharedModule
    ],
    controllers: [ProductPartController],
    providers: [ProductPartService, ProductPartIDsExistenceValidator],
    exports: [ProductPartService]
})

export class ProductPartModule { }
