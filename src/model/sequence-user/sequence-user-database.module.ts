import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SequenceUserSchema } from './sequence-user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Sequence_User', schema: SequenceUserSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class SequenceUserDatabaseModule {}
