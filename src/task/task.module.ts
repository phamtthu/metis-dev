import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDatabaseModule } from 'src/model/task/task-database.module';
import { TaskController } from './task.controller';
import { ProductDatabaseModule } from 'src/model/product/product-database.module';
import { TaskExistValidator } from './custom-validator/task-id-existence.validator';
import { UserDatabaseModule } from 'src/model/user/user-database.module';
import { TaskUserDatabaseModule } from 'src/model/task-user/taskuser-database.module';
import { TaskGroupDatabaseModule } from 'src/model/task_group/task-group-database.module';
import { TaskStatusDatabaseModule } from 'src/model/task-status/task-status-database.module';
import { ProductWorkCenterDatabaseModule } from 'src/model/product-workcenter/product-workcenter-database.module';
import { AttachmentDatabaseModule } from 'src/model/attachment/attachment-database.module';
import { CommentDatabaseModule } from 'src/model/comment/comment-database.module';
import { TaskChecklistDatabaseModule } from 'src/model/task-checklist/task-checklist-database.module';
import { ItemDatabaseModule } from 'src/model/item/item-database.module';

@Module({
  imports: [
    TaskDatabaseModule,
    UserDatabaseModule,
    ProductDatabaseModule,
    TaskUserDatabaseModule,
    TaskGroupDatabaseModule,
    TaskStatusDatabaseModule,
    ProductWorkCenterDatabaseModule,
    AttachmentDatabaseModule,
    CommentDatabaseModule,
    TaskChecklistDatabaseModule,
    ItemDatabaseModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskExistValidator],
  exports: [TaskService],
})
export class TaskModule {}
