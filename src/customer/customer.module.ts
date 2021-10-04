import { Module } from '@nestjs/common';
import { CustomerDatabaseModule } from 'src/model/customer/customer-database.module';
import { OrderDatabaseModule } from 'src/model/order/order-database.module';
import { OrderProductDatabaseModule } from 'src/model/order-product/order-product.database.module';
import { CustomerIdExistenceValidator } from './custom-validator/customer-id.validator';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [
    CustomerDatabaseModule,
    OrderDatabaseModule,
    OrderProductDatabaseModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerIdExistenceValidator],
  exports: [CustomerService],
})
export class CustomerModule {}
