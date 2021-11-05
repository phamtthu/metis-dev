import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportSchema } from './report.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Report', schema: ReportSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class ReportDatabaseModule {}
