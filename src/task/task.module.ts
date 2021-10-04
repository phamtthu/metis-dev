import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDatabaseModule } from 'src/model/task/task-database.module';
import { TaskController } from './task.controller';
import { ProductDatabaseModule } from 'src/model/product/product-database.module';
import { TaskIDExistenceValidator } from './custom-validator/task-id-existence.validator';
import { UserDatabaseModule } from 'src/model/user/user-database.module';
import { TaskUserDatabaseModule } from 'src/model/task-user/taskuser-database.module';

@Module({
  imports: [
    TaskDatabaseModule,
    UserDatabaseModule,
    ProductDatabaseModule,
    TaskUserDatabaseModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskIDExistenceValidator],
  exports: [TaskService],
})
export class TaskModule {}
