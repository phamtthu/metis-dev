import { Module } from '@nestjs/common';
import { ProductDatabaseModule } from 'src/model/product/product-database.module';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderDatabaseModule } from 'src/model/order/order-database.module';
import { CustomerDatabaseModule } from 'src/model/customer/customer-database.module';
import { OrderProductDatabaseModule } from 'src/model/order-product/order-product.database.module';

@Module({
  imports: [
    OrderDatabaseModule,
    ProductDatabaseModule,
    CustomerDatabaseModule,
    OrderProductDatabaseModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
