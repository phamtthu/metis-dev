import { Module } from '@nestjs/common';
import { TaskDatabaseModule } from 'src/model/task/task-database.module';
import { TaskStatusDatabaseModule } from 'src/model/task-status/task-status-database.module';
import { TaskStatusExistValidator } from './custom-validator/task-status-id-existence.validator';
import { TaskStatusController } from './task-status.controller';
import { TaskStatusService } from './task-status.service';
import { BoardDatabaseModule } from 'src/model/board/board-database.module';
import { TaskGroupDatabaseModule } from 'src/model/task_group/task-group-database.module';

@Module({
  imports: [
    TaskStatusDatabaseModule,
    TaskDatabaseModule,
    BoardDatabaseModule,
    TaskGroupDatabaseModule,
  ],
  controllers: [TaskStatusController],
  providers: [TaskStatusService, TaskStatusExistValidator],
  exports: [TaskStatusService],
})
export class TaskStatusModule {}
