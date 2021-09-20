import { Module } from "@nestjs/common"
import { LaborDatabaseModule } from "src/model/labor-database.module";
import { WorkCenterDatabaseModule } from "src/model/workcenter-database.module";
import { SharedModule } from "src/shared/shared.module";
import { ResourceDatabaseModule } from "../model/resource-database.module";
import { ResourceController } from "./resource.controller";
import { ResourceService } from "./resource.service";

@Module({
    imports: [
        ResourceDatabaseModule,
        LaborDatabaseModule,
        WorkCenterDatabaseModule,
        SharedModule
    ],
    controllers: [ResourceController],
    providers: [ResourceService],
    exports: [ResourceService]
})

export class ResourceModule { }
