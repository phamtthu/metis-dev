import { Module } from '@nestjs/common';
import { LabelDatabaseModule } from 'src/model/label/label-database.module';
import { TaskDatabaseModule } from 'src/model/task/task-database.module';
import { LabelIDsExistenceValidator } from './custom-validtor/label-ids-existence.validator';
import { LabelController } from './label.controller';
import { LabelService } from './label.service';

@Module({
  imports: [LabelDatabaseModule, TaskDatabaseModule],
  controllers: [LabelController],
  providers: [LabelService, LabelIDsExistenceValidator],
  exports: [LabelService],
})
export class LabelModule {}
