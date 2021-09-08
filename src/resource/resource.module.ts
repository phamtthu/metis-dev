import { Module } from "@nestjs/common"
import { LaborDatabaseModule } from "src/model/labor-database.module";
import { ResourceDatabaseModule } from "../model/resource-database.module";
import { ResourceController } from "./resource.controller";
import { ResourceService } from "./resource.service";

@Module({
    imports: [
        ResourceDatabaseModule,
        LaborDatabaseModule
    ],
    controllers: [ResourceController],
    providers: [ResourceService],
    exports: [ResourceService]
})

export class ResourceModule { }
