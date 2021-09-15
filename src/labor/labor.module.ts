import { Module } from "@nestjs/common"
import { LaborController } from "./labor.controller"
import { LaborService } from "./labor.service"
import { LaborIDsExistenceValidator } from "./custom-validator/laborIds.validator"
import { ResourceDatabaseModule } from "src/model/resource-database.module"
import { LaborDatabaseModule } from "src/model/labor-database.module"
import { WorkCenterDatabaseModule } from "src/model/workcenter-database.module"
import { SharedModule } from "src/shared/shared.module"

@Module({
    imports: [
        LaborDatabaseModule,
        ResourceDatabaseModule,
        WorkCenterDatabaseModule,
        SharedModule
    ],
    controllers: [LaborController],
    providers: [LaborService, LaborIDsExistenceValidator],
    exports: [LaborService,LaborIDsExistenceValidator]
})

export class LaborModule { }
