import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskStatusSchema } from './taskstatuses.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Task_Status', schema: TaskStatusSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class TaskStatusDatabaseModule {}
