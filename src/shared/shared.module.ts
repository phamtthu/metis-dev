import { Module } from '@nestjs/common';
import { CustomerDatabaseModule } from 'src/model/customer-database.module';
import { LabelDatabaseModule } from 'src/model/label-database.module';
import { UserDatabaseModule } from 'src/model/user-database.module';
import { OrderDatabaseModule } from 'src/model/order-database.module';
import { PartCategoryDatabaseModule } from 'src/model/partcategory-database.module';
import { PositionDatabaseModule } from 'src/model/position-database.module';
import { ProcessDatabaseModule } from 'src/model/process-database.module';
import { ProductDatabaseModule } from 'src/model/product-database.module';
import { ProductCategoryDatabaseModule } from 'src/model/productcategory-database.module';
import { ProductPartDatabaseModule } from 'src/model/productpart-database.module';
import { ResourceDatabaseModule } from 'src/model/resource-database.module';
import { ResourceCategoryDatabaseModule } from 'src/model/resource-category-database.module';
import { SequenceDatabaseModule } from 'src/model/sequence-database.module';
import { SkillDatabaseModule } from 'src/model/skill-database.module';
import { TaskDatabaseModule } from 'src/model/task-database.module';
import { TaskStatusDatabaseModule } from 'src/model/taskstatuses-database.module';
import { WorkCenterDatabaseModule } from 'src/model/workcenter-database.module';
import { PositionID } from './pipe/positionId.pipe';
import { SharedService } from './shared.service';

@Module({
  imports: [
    PositionDatabaseModule,
    SkillDatabaseModule,
    ResourceCategoryDatabaseModule,
    ProductCategoryDatabaseModule,
    UserDatabaseModule,
    ResourceDatabaseModule,
    WorkCenterDatabaseModule,
    TaskDatabaseModule,
    ProductDatabaseModule,
    OrderDatabaseModule,
    CustomerDatabaseModule,
    LabelDatabaseModule,
    ProcessDatabaseModule,
    SequenceDatabaseModule,
    UserDatabaseModule,
    TaskStatusDatabaseModule,
    ProductPartDatabaseModule,
    PartCategoryDatabaseModule,
  ],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {}
