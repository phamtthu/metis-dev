import { Module } from '@nestjs/common';
import { ProductDatabaseModule } from 'src/model/product-database.module';
import { ProductCategoryDatabaseModule } from 'src/model/productcategory-database.module';
import { SharedModule } from 'src/shared/shared.module';
import { PCategoryIDExistenceValidator } from './custom-validator/pcategoryId-existence.validator';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryService } from './product-category.service';

@Module({
  imports: [ProductCategoryDatabaseModule, ProductDatabaseModule, SharedModule],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService, PCategoryIDExistenceValidator],
  exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
