import { Module } from "@nestjs/common"
import { UserDatabaseModule } from "src/model/user-database.module"
import { ResourceDatabaseModule } from "src/model/resource-database.module"
import { WorkCenterDatabaseModule } from "src/model/workcenter-database.module"
import { SharedModule } from "src/shared/shared.module"
import { WorkCenterIDExistenceValidator } from "./custom-validator/workcenterId.validator"
import { WorkCenterController } from "./workcenter.controller"
import { WorkCenterService } from "./workcenter.service"

@Module({
    imports: [
        /* sadasdadadad */
        WorkCenterDatabaseModule,
        UserDatabaseModule,
        ResourceDatabaseModule,
        SharedModule
    ],
    controllers: [WorkCenterController],
    providers: [WorkCenterService, WorkCenterIDExistenceValidator],
    exports: [WorkCenterService]
})

export class WorkCenterModule { }