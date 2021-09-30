import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResourceCategorySchema } from './resource-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Resource_Category', schema: ResourceCategorySchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class ResourceCategoryDatabaseModule {}
