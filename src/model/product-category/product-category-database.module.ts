import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductCategorySchema } from './product-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Product_Category', schema: ProductCategorySchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class ProductCategoryDatabaseModule {}
