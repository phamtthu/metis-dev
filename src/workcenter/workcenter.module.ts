import { Module } from '@nestjs/common';
import { UserDatabaseModule } from 'src/model/user-database.module';
import { ResourceDatabaseModule } from 'src/model/resource-database.module';
import { WorkCenterDatabaseModule } from 'src/model/workcenter-database.module';
import { SharedModule } from 'src/shared/shared.module';
import { WorkCenterIDExistenceValidator } from './custom-validator/workcenterId.validator';
import { WorkCenterController } from './workcenter.controller';
import { WorkCenterService } from './workcenter.service';
import { WorkCenterUserDatabaseModule } from 'src/model/workcenter-user-database.module';
import { WorkCenterResourceDatabaseModule } from 'src/model/workcenter-resource-database.module';

@Module({
  imports: [
    WorkCenterDatabaseModule,
    UserDatabaseModule,
    ResourceDatabaseModule,
    WorkCenterUserDatabaseModule,
    WorkCenterResourceDatabaseModule,
    SharedModule,
  ],
  controllers: [WorkCenterController],
  providers: [WorkCenterService, WorkCenterIDExistenceValidator],
  exports: [WorkCenterService],
})
export class WorkCenterModule {}
