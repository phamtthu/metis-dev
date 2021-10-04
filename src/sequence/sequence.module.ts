import { Module } from '@nestjs/common';
import { SequenceDatabaseModule } from 'src/model/sequence/sequence-database.module';
import { SequenceController } from './sequence.controller';
import { SequenceService } from './sequence.service';
import { SequenceIDExistenceValidator } from './custom-validator/sequence-id-existence.validator';
import { ResourceDatabaseModule } from 'src/model/resource/resource-database.module';
import { UserDatabaseModule } from 'src/model/user/user-database.module';
import { ProcessDatabaseModule } from 'src/model/process/process-database.module';
import { SequenceResourceDatabaseModule } from 'src/model/sequence-resource/sequence-resource-database.module';
import { SequenceUserDatabaseModule } from 'src/model/sequence-user/sequence-user-database.module';

@Module({
  imports: [
    SequenceDatabaseModule,
    ProcessDatabaseModule,
    ResourceDatabaseModule,
    SequenceResourceDatabaseModule,
    UserDatabaseModule,
    SequenceUserDatabaseModule,
  ],
  controllers: [SequenceController],
  providers: [SequenceService, SequenceIDExistenceValidator],
  exports: [SequenceService],
})
export class SequenceModule {}
