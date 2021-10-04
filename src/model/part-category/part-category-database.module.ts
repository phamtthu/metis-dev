import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PartCategorySchema } from './part-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Part_Category', schema: PartCategorySchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class PartCategoryDatabaseModule {}
