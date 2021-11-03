import { Module } from '@nestjs/common';
import { ItemDatabaseModule } from 'src/model/item/item-database.module';
import { TaskChecklistDatabaseModule } from 'src/model/task-checklist/task-checklist-database.module';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  imports: [ItemDatabaseModule, TaskChecklistDatabaseModule],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
