import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductWorkCenterSchema } from './product-workcenter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Product_WorkCenter', schema: ProductWorkCenterSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class ProductWorkCenterDatabaseModule {}
