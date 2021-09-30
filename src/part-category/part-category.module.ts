import { Module } from '@nestjs/common';
import { PartCategoryDatabaseModule } from 'src/model/partcategory-database.module';
import { ProductPartDatabaseModule } from 'src/model/productpart-database.module';

import { SharedModule } from 'src/shared/shared.module';
import { PartCategoryIDExistenceValidator } from './custom-validator/part-categoryId-existence.validator';
import { PartCategoryController } from './part-category.controller';
import { PartCategoryService } from './part-category.service';

@Module({
  imports: [
    PartCategoryDatabaseModule,
    ProductPartDatabaseModule,
    SharedModule,
  ],
  controllers: [PartCategoryController],
  providers: [PartCategoryService, PartCategoryIDExistenceValidator],
  exports: [PartCategoryService],
})
export class PartCategoryModule {}
