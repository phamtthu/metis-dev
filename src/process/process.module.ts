import { Module } from '@nestjs/common';
import { ProcessDatabaseModule } from 'src/model/process/process-database.module';

import { ProcessController } from './process.controller';
import { ProcessService } from './process.service';
import { ProcessIDExistenceValidator } from './custom-validator/process-id-existence.validator';
import { SequenceDatabaseModule } from 'src/model/sequence/sequence-database.module';

@Module({
  imports: [ProcessDatabaseModule, SequenceDatabaseModule],
  controllers: [ProcessController],
  providers: [ProcessService, ProcessIDExistenceValidator],
  exports: [ProcessService],
})
export class ProcessModule {}
