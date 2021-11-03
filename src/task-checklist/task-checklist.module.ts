import { Module } from '@nestjs/common';
import { TaskChecklistDatabaseModule } from 'src/model/task-checklist/task-checklist-database.module';
import { TaskChecklistExistValidator } from './custom-validator/task-checklist-exist.validator';
import { TaskChecklistController } from './task-checklist.controller';
import { TaskChecklistService } from './task-checklist.service';

@Module({
  imports: [TaskChecklistDatabaseModule],
  controllers: [TaskChecklistController],
  providers: [TaskChecklistService, TaskChecklistExistValidator],
  exports: [TaskChecklistService],
})
export class TaskChecklistModule {}
