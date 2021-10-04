import { Module } from '@nestjs/common';
import { ProductWorkCenterDatabaseModule } from 'src/model/product-workcenter/product-workcenter-database.module';
import { ResourceUserDatabaseModule } from 'src/model/resource-user/resource-user-database.module';
import { SequenceResourceDatabaseModule } from 'src/model/sequence-resource/sequence-resource-database.module';
import { UserDatabaseModule } from 'src/model/user/user-database.module';
import { WorkCenterResourceDatabaseModule } from 'src/model/workcenter-resource/workcenter-resource-database.module';
import { ResourceDatabaseModule } from '../model/resource/resource-database.module';
import { ResourceIDsExistenceValidator } from './custom-validator/resource-ids-existence-validator';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';

@Module({
  imports: [
    ResourceDatabaseModule,
    UserDatabaseModule,
    ResourceUserDatabaseModule,
    WorkCenterResourceDatabaseModule,
    SequenceResourceDatabaseModule,
    ProductWorkCenterDatabaseModule,
  ],
  controllers: [ResourceController],
  providers: [ResourceService, ResourceIDsExistenceValidator],
  exports: [ResourceService],
})
export class ResourceModule {}
