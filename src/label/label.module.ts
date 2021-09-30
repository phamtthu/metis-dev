import { Module } from '@nestjs/common';
import { LabelDatabaseModule } from 'src/model/label-database.module';
import { TaskDatabaseModule } from 'src/model/task-database.module';
import { SharedModule } from 'src/shared/shared.module';
import { LabelIDsExistenceValidator } from './custom-validtor/labelId-existence.validator';
import { LabelController } from './label.controller';
import { LabelService } from './label.service';

@Module({
  imports: [LabelDatabaseModule, TaskDatabaseModule, SharedModule],
  controllers: [LabelController],
  providers: [LabelService, LabelIDsExistenceValidator],
  exports: [LabelService],
})
export class LabelModule {}
