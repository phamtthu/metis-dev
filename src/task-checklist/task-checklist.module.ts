import { Module } from '@nestjs/common';
import { TaskChecklistDatabaseModule } from 'src/model/task-checklist/task-checklist-database.module';
import { TaskChecklistController } from './task-checklist.controller';
import { TaskChecklistService } from './task-checklist.service';

@Module({
  imports: [TaskChecklistDatabaseModule],
  controllers: [TaskChecklistController],
  providers: [TaskChecklistService],
  exports: [TaskChecklistService],
})
export class TaskChecklistModule {}
