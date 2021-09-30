import { Module } from "@nestjs/common"
import { SkillService } from "./skill.service"
import { SkillDatabaseModule } from "src/model/skill-database.module"
import { SkillController } from "./skill.controller"
import { SharedModule } from "src/shared/shared.module"
import { SkillIDExistenceValidator } from "./custom-validator/skillId-existence.validator"
import { UserDatabaseModule } from "src/model/user-database.module"

@Module({
    imports: [
        SkillDatabaseModule,
        UserDatabaseModule,
        SharedModule
    ],
    controllers: [SkillController],
    providers: [SkillService, SkillIDExistenceValidator],
    exports: [SkillService]
})

export class SkillModule { }
