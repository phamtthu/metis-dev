import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskGroupSchema } from './task-group.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Task_Group', schema: TaskGroupSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class TaskGroupDatabaseModule {}
