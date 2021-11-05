import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillDatabaseModule } from 'src/model/skill/skill-database.module';
import { SkillController } from './skill.controller';
import { SkillExistValidator } from './custom-validator/skill-id-existence.validator';
import { TaskDatabaseModule } from 'src/model/task/task-database.module';
import { UserDatabaseModule } from 'src/model/user/user-database.module';

@Module({
  imports: [SkillDatabaseModule, TaskDatabaseModule, UserDatabaseModule],
  controllers: [SkillController],
  providers: [SkillService, SkillExistValidator],
  exports: [SkillService],
})
export class SkillModule {}
