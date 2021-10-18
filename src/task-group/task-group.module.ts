import { Module } from '@nestjs/common';
import { TaskStatusDatabaseModule } from 'src/model/task-status/task-status-database.module';
import { TaskGroupDatabaseModule } from 'src/model/task_group/task-group-database.module';
import { TaskGroupExistValidator } from './custom-validator/task-group-id-existence.validator';
import { TaskGroupController } from './task-group.controller';
import { TaskGroupService } from './task-group.service';

@Module({
  imports: [TaskGroupDatabaseModule, TaskStatusDatabaseModule],
  controllers: [TaskGroupController],
  providers: [TaskGroupService, TaskGroupExistValidator],
  exports: [TaskGroupService],
})
export class TaskGroupModule {}
