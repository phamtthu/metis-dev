import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PartSchema } from './part.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Part', schema: PartSchema }])],
  exports: [MongooseModule],
})
export class PartDatabaseModule {}
