import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillDatabaseModule } from 'src/model/skill/skill-database.module';
import { SkillController } from './skill.controller';

import { SkillIDExistenceValidator } from './custom-validator/skill-id-existence.validator';
import { TaskDatabaseModule } from 'src/model/task/task-database.module';

@Module({
  imports: [SkillDatabaseModule, TaskDatabaseModule],
  controllers: [SkillController],
  providers: [SkillService, SkillIDExistenceValidator],
  exports: [SkillService],
})
export class SkillModule {}
