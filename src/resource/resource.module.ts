import { Module } from "@nestjs/common"
import { ResourceUserDatabaseModule } from "src/model/resource-user-database.module";
import { UserDatabaseModule } from "src/model/user-database.module";
import { WorkCenterResourceDatabaseModule } from "src/model/workcenter-resource-database.module";
import { SharedModule } from "src/shared/shared.module";
import { ResourceDatabaseModule } from "../model/resource-database.module";
import { ResourceIDsExistenceValidator } from "./custom-validator/resourceIds-existence-validator";
import { ResourceController } from "./resource.controller";
import { ResourceService } from "./resource.service";

@Module({
    imports: [
        ResourceDatabaseModule,
        UserDatabaseModule,
        ResourceUserDatabaseModule,
        WorkCenterResourceDatabaseModule,
        SharedModule
    ],
    controllers: [ResourceController],
    providers: [ResourceService, ResourceIDsExistenceValidator],
    exports: [ResourceService]
})

export class ResourceModule { }
