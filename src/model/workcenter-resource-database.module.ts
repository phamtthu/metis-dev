import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkCenterResourceSchema } from './workcenter-resource.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'WorkCenter_Resource', schema: WorkCenterResourceSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class WorkCenterResourceDatabaseModule {}
