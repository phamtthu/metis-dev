import { Module } from '@nestjs/common';
import { ResourceDatabaseModule } from 'src/model/resource/resource-database.module';
import { ResourceCategoryDatabaseModule } from 'src/model/resource-category/resource-category-database.module';
import { ResourceCategoryIDExistenceValidator } from './custom-validator/resource-category-id-existence.validator';
import { ResourceCategoryController } from './resource-category.controller';
import { ResourceCategoryService } from './resource-category.service';

@Module({
  imports: [ResourceCategoryDatabaseModule, ResourceDatabaseModule],
  controllers: [ResourceCategoryController],
  providers: [ResourceCategoryService, ResourceCategoryIDExistenceValidator],
  exports: [ResourceCategoryService],
})
export class ResourceCategoryModule {}
