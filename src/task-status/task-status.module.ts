import { Module } from '@nestjs/common';
import { TaskDatabaseModule } from 'src/model/task/task-database.module';
import { TaskStatusDatabaseModule } from 'src/model/task-status/task-status-database.module';

import { TaskStatusIDExistenceValidator } from './custom-validator/task-status-id-existence.validator';
import { TaskStatusController } from './task-status.controller';
import { TaskStatusService } from './task-status.service';

@Module({
  imports: [TaskStatusDatabaseModule, TaskDatabaseModule],
  controllers: [TaskStatusController],
  providers: [TaskStatusService, TaskStatusIDExistenceValidator],
  exports: [TaskStatusService],
})
export class TaskStatusModule {}
