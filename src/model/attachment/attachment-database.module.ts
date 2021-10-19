import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttachmentSchema } from './attachment-schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Attachment', schema: AttachmentSchema }])],
  exports: [MongooseModule],
})
export class AttachmentDatabaseModule {}
