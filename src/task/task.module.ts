import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { TaskService } from './task.service';
import { TaskDatabaseModule } from 'src/model/task-database.module';
import { TaskController } from './task.controller';
import { ProductDatabaseModule } from 'src/model/product-database.module';
import { TaskIDExistenceValidator } from './custom-validator/taskId-existence.validator';
import { UserDatabaseModule } from 'src/model/user-database.module';
import { TaskUserDatabaseModule } from 'src/model/taskuser-database.module';

@Module({
  imports: [
    TaskDatabaseModule,
    UserDatabaseModule,
    ProductDatabaseModule,
    TaskUserDatabaseModule,
    SharedModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskIDExistenceValidator],
  exports: [TaskService],
})
export class TaskModule {}
