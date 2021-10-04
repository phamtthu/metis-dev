import { Module } from '@nestjs/common';
import { ProductDatabaseModule } from 'src/model/product/product-database.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductIDExistenceValidator } from './custom-validator/product-id-existence.validator';
import { TaskDatabaseModule } from 'src/model/task/task-database.module';
import { OrderDatabaseModule } from 'src/model/order/order-database.module';
import { PartDatabaseModule } from 'src/model/part/part-database.module';
import { ProductWorkCenterDatabaseModule } from 'src/model/product-workcenter/product-workcenter-database.module';
import { OrderProductDatabaseModule } from 'src/model/order-product/order-product.database.module';
import { ProductPartDatabaseModule } from 'src/model/product-part/product-part-database.module';

@Module({
  imports: [
    ProductDatabaseModule,
    TaskDatabaseModule,
    OrderDatabaseModule,
    PartDatabaseModule,
    ProductPartDatabaseModule,
    ProductWorkCenterDatabaseModule,
    PartDatabaseModule,
    OrderProductDatabaseModule,
    ProductWorkCenterDatabaseModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductIDExistenceValidator],
  exports: [ProductService],
})
export class ProductModule {}
