import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductPartSchema } from './product-part.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Product_Part', schema: ProductPartSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class ProductPartDatabaseModule {}
