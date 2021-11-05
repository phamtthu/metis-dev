import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportDatabaseModule } from 'src/model/report/report-database.module';
import { ReportService } from './report.service';
import { UserDatabaseModule } from 'src/model/user/user-database.module';

@Module({
  imports: [ReportDatabaseModule, UserDatabaseModule],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
