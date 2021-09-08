import { Module } from "@nestjs/common"
import { LaborController } from "./labor.controller"
import { LaborService } from "./labor.service"
import { LaborIDsExistenceValidator } from "./custom-validator/laborIds.validation"
import { ResourceDatabaseModule } from "src/model/resource-database.module"
import { LaborDatabaseModule } from "src/model/labor-database.module"

@Module({
    imports: [
        LaborDatabaseModule,
        ResourceDatabaseModule
    ],
    controllers: [LaborController],
    providers: [LaborService, LaborIDsExistenceValidator],
    exports: [LaborService,LaborIDsExistenceValidator]
})

export class LaborModule { }
