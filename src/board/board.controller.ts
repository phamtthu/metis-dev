import {
  Body,
  Put,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { messageError } from 'src/common/utils/error';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { BoardService } from './board.service';
import { AuthGuard } from '@nestjs/passport';
import { BoardMemberGuard } from 'src/auth/guard/board-members.guard';
import { UpdateBoardDTO } from './dto/update-board.dto';

@Controller('api/board')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
@UseGuards(AuthGuard('jwt'))
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get()
  async getList(@Request() req) {
    try {
      const result = await this.boardService.getList(req.user._id);
      return result;
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/:boardId')
  @UseGuards(BoardMemberGuard)
  async getDetail(@Request() req, @Param('boardId') boardId: string) {
    try {
      return { data: req.board };
    } catch (error) {
      messageError(error);
    }
  }

  @Put('/:boardId')
  @UseGuards(BoardMemberGuard)
  async update(
    @Request() req,
    @Body() boardDTO: UpdateBoardDTO,
  ) {
    try {
      const result = await this.boardService.update(req.board, boardDTO);
      return {
        message: 'Update Board successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }
}
