import { Module } from "@nestjs/common"
import { LaborDatabaseModule } from "src/model/labor-database.module"
import { PositionDatabaseModule } from "src/model/position-database.module"
import { SharedModule } from "src/shared/shared.module"
import { PositionIDExistenceValidator } from "./custom-validator/positionId-existence.validator"
import { PositionController } from "./position.controller"
import { PositionService } from "./position.service"

@Module({
    imports: [
        PositionDatabaseModule,
        LaborDatabaseModule,
        SharedModule
    ],
    controllers: [PositionController],
    providers: [PositionService, PositionIDExistenceValidator],
    exports: [PositionService]
})

export class PositionModule { }
