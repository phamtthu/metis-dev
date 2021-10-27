import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { UserDatabaseModule } from 'src/model/user/user-database.module';
import { CommentDatabaseModule } from 'src/model/comment/comment-database.module';

@Module({
  imports: [UserDatabaseModule, CommentDatabaseModule],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
