import { AttachmentDatabaseModule } from 'src/model/attachment/attachment-database.module';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';
import { Module } from '@nestjs/common';
import { AttachmentExistValidator } from './custom-validator/attachment-ids-existence.validator';

@Module({
  imports: [AttachmentDatabaseModule],
  providers: [AttachmentService, AttachmentExistValidator],
  controllers: [AttachmentController],
  exports: [AttachmentService],
})
export class AttachmentModule {}
