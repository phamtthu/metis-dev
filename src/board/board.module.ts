import { Module } from '@nestjs/common';
import { BoardDatabaseModule } from 'src/model/board/board-database.module';
import { ProductWorkCenterDatabaseModule } from 'src/model/product-workcenter/product-workcenter-database.module';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [BoardDatabaseModule, ProductWorkCenterDatabaseModule],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {}
