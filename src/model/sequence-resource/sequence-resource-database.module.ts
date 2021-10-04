import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SequenceResourceSchema } from './sequence-resource.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Sequence_Resource', schema: SequenceResourceSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class SequenceResourceDatabaseModule {}
