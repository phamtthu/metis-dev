import { Module } from "@nestjs/common"
import { SequenceDatabaseModule } from "src/model/sequence-database.module"
import { SharedModule } from "src/shared/shared.module"
import { SequenceController } from "./sequence.controller"
import { SequenceService } from "./sequence.service"
import { SequenceIDExistenceValidator } from "./custom-validator/sequenceId-existence.validator"
import { ResourceDatabaseModule } from "src/model/resource-database.module"
import { UserDatabaseModule } from "src/model/user-database.module"
import { ProcessDatabaseModule } from "src/model/process-database.module"


@Module({
    imports: [
        SequenceDatabaseModule,
        ProcessDatabaseModule,
        ResourceDatabaseModule,
        UserDatabaseModule,
        SharedModule
    ],
    controllers: [SequenceController],
    providers: [SequenceService, SequenceIDExistenceValidator],
    exports: [SequenceService]
})

export class SequenceModule { }