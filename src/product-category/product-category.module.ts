import { Module } from '@nestjs/common';
import { ProductDatabaseModule } from 'src/model/product/product-database.module';
import { ProductCategoryDatabaseModule } from 'src/model/product-category/product-category-database.module';
import { PCategoryIDExistenceValidator } from './custom-validator/pcategory-id-existence.validator';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryService } from './product-category.service';

@Module({
  imports: [ProductCategoryDatabaseModule, ProductDatabaseModule],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService, PCategoryIDExistenceValidator],
  exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
