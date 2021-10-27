import { Module } from '@nestjs/common';
import { AttachmentDatabaseModule } from 'src/model/attachment/attachment-database.module';
import { BoardDatabaseModule } from 'src/model/board/board-database.module';
import { CommentDatabaseModule } from 'src/model/comment/comment-database.module';
import { LabelDatabaseModule } from 'src/model/label/label-database.module';
import { ProductWorkCenterDatabaseModule } from 'src/model/product-workcenter/product-workcenter-database.module';
import { TaskChecklistDatabaseModule } from 'src/model/task-checklist/task-checklist-database.module';
import { TaskUserDatabaseModule } from 'src/model/task-user/taskuser-database.module';
import { TaskDatabaseModule } from 'src/model/task/task-database.module';
import { TaskGroupDatabaseModule } from 'src/model/task_group/task-group-database.module';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { BoardExistValidator } from './custom-validator/board-id-existence.validator';

@Module({
  imports: [
    BoardDatabaseModule,
    ProductWorkCenterDatabaseModule,
    TaskDatabaseModule,
    TaskGroupDatabaseModule,
    TaskUserDatabaseModule,
    LabelDatabaseModule,
    TaskChecklistDatabaseModule,
    CommentDatabaseModule,
    AttachmentDatabaseModule
  ],
  controllers: [BoardController],
  providers: [BoardService, BoardExistValidator],
  exports: [BoardService],
})
export class BoardModule {}
