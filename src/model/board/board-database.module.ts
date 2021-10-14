import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardSchema } from './board-schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Board', schema: BoardSchema }])],
  exports: [MongooseModule],
})
export class BoardDatabaseModule {}
