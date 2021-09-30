import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LabelSchema } from './label.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Label', schema: LabelSchema }]),
  ],
  exports: [MongooseModule],
})
export class LabelDatabaseModule {}
