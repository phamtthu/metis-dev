import { Module } from '@nestjs/common';
import { ProductDatabaseModule } from 'src/model/product/product-database.module';
import { PartDatabaseModule } from 'src/model/part/part-database.module';
import { PartIDsExistenceValidator } from './custom-validator/part-ids-exitence.validator';
import { PartController } from './part.controller';
import { PartService } from './part.service';

@Module({
  imports: [PartDatabaseModule, ProductDatabaseModule],
  controllers: [PartController],
  providers: [PartService, PartIDsExistenceValidator],
  exports: [PartService],
})
export class PartModule {}
