import { AttachmentDatabaseModule } from 'src/model/attachment/attachment-database.module';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [AttachmentDatabaseModule],
  providers: [AttachmentService],
  controllers: [AttachmentController],
  exports: [AttachmentService],
})
export class AttachmentModule {}
