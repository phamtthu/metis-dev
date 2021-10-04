import { Module } from '@nestjs/common';
import { PartCategoryDatabaseModule } from 'src/model/part-category/part-category-database.module';
import { PartDatabaseModule } from 'src/model/part/part-database.module';

import { PartCategoryIDExistenceValidator } from './custom-validator/part-category-id-existence.validator';
import { PartCategoryController } from './part-category.controller';
import { PartCategoryService } from './part-category.service';

@Module({
  imports: [PartCategoryDatabaseModule, PartDatabaseModule],
  controllers: [PartCategoryController],
  providers: [PartCategoryService, PartCategoryIDExistenceValidator],
  exports: [PartCategoryService],
})
export class PartCategoryModule {}
