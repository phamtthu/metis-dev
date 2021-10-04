import { Module } from '@nestjs/common';
import { UserDatabaseModule } from 'src/model/user/user-database.module';
import { ResourceDatabaseModule } from 'src/model/resource/resource-database.module';
import { WorkCenterDatabaseModule } from 'src/model/workcenter/workcenter-database.module';
import { WorkCenterIDExistenceValidator } from './custom-validator/workcenter-id.validator';
import { WorkCenterController } from './workcenter.controller';
import { WorkCenterService } from './workcenter.service';
import { WorkCenterUserDatabaseModule } from 'src/model/workcenter-user/workcenter-user-database.module';
import { WorkCenterResourceDatabaseModule } from 'src/model/workcenter-resource/workcenter-resource-database.module';
import { ProductWorkCenterDatabaseModule } from 'src/model/product-workcenter/product-workcenter-database.module';

@Module({
  imports: [
    WorkCenterDatabaseModule,
    UserDatabaseModule,
    ResourceDatabaseModule,
    WorkCenterUserDatabaseModule,
    WorkCenterResourceDatabaseModule,
    ProductWorkCenterDatabaseModule,
  ],
  controllers: [WorkCenterController],
  providers: [WorkCenterService, WorkCenterIDExistenceValidator],
  exports: [WorkCenterService],
})
export class WorkCenterModule {}
