import { Module } from "@nestjs/common"
import { ProcessDatabaseModule } from "src/model/process-database.module"
import { SharedModule } from "src/shared/shared.module"
import { ProcessController } from "./process.controller"
import { ProcessService } from "./process.service"
import { ProcessIDExistenceValidator } from "./custom-validator/processId-existence.validator"
import { SequenceDatabaseModule } from "src/model/sequence-database.module"


@Module({
    imports: [
        ProcessDatabaseModule,
        SequenceDatabaseModule,
        SharedModule
    ],
    controllers: [ProcessController],
    providers: [ProcessService, ProcessIDExistenceValidator],
    exports: [ProcessService]
})

export class ProcessModule { }