import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductCategorySchema } from './productcategory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ProductCategory', schema: ProductCategorySchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class ProductCategoryDatabaseModule {}
