import { Module } from '@nestjs/common';
import { ProductWorkCenterDatabaseModule } from 'src/model/product-workcenter/product-workcenter-database.module';
import { ProductWorkCenterIDExistenceValidator } from './custom-validator/product-workcenter-id.existence.validator';
import { ProductWorkCenterService } from './product-workcenter.service';

@Module({
  imports: [ProductWorkCenterDatabaseModule],
  providers: [ProductWorkCenterService, ProductWorkCenterIDExistenceValidator],
  exports: [ProductWorkCenterService],
})
export class ProductWorkCenterModule {}
