import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskChecklistSchema } from './task-checklist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Task_Checklist', schema: TaskChecklistSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class TaskChecklistDatabaseModule {}
