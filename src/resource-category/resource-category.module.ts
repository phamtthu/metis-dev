import { Module } from "@nestjs/common"
import { ResourceDatabaseModule } from "src/model/resource-database.module"
import { ResourceCategoryDatabaseModule } from "src/model/resourcecategory-database.module"
import { SharedModule } from "src/shared/shared.module"
import { RCategoryIDExistenceValidator } from "./custom-validator/rcategoryId-existence.validator"
import { ResourceCategoryController } from "./resource-category.controller"
import { ResourceCategoryService } from "./resource-category.service"


@Module({
    imports: [
        ResourceCategoryDatabaseModule,
        ResourceDatabaseModule,
        SharedModule
    ],
    controllers: [ResourceCategoryController],
    providers: [ResourceCategoryService, RCategoryIDExistenceValidator],
    exports: [ResourceCategoryService]
})

export class ResourceCategoryModule { }
