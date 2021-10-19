import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardMemberGuard } from 'src/auth/guard/board-members.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { messageError } from 'src/common/utils/error';
import { CommentService } from './comment.service';
import { AddCommentDto } from './dto/add-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('api/comment')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post()
  @UseGuards(BoardMemberGuard)
  async create(@Request() req, @Body() commentDto: AddCommentDto) {
    try {
      const result = await this.commentService.create(commentDto, req.user._id);
      return {
        message: 'Create Comment successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Put('/:commentId')
  async update(
    @Request() req,
    @Body() commentDto: UpdateCommentDto,
    @Param('commentId') commentId: string,
  ) {
    try {
      const result = await this.commentService.update(
        commentId,
        commentDto,
        req.user._id,
      );
      return {
        message: 'Update Comment successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Delete('/:commentId')
  async softDelete(@Request() req, @Param('commentId') commentId: string) {
    try {
      await this.commentService.softDelete(commentId, req.user._id);
      return {
        message: 'Soft Delete Comment successfully',
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/restore/:commentId')
  async restore(@Request() req, @Param('commentId') commentId: string) {
    try {
      const result = await this.commentService.restore(commentId, req.user._id);
      return {
        message: 'Restore Comment successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }
}
