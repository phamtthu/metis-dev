import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderProductSchema } from './order-product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order_Product', schema: OrderProductSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class OrderProductDatabaseModule {}
