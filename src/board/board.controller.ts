import {
  Body,
  Delete,
  Put,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { messageError } from 'src/common/utils/error';
import { BoardService } from './board.service';
import { BoardMemberGuard } from 'src/auth/guard/board-members.guard';
import { UpdateBoardDTO } from './dto/update-board.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('api/board')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
@UseGuards(JwtAuthGuard)
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

  // Boards - Working time statistics(h)
  @Get('/working-time-stats')
  async getWorkingTimeStats(@Request() req) {
    try {
      const result = await this.boardService.getWorkingTimeStats();
      return result;
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/:boardId')
  @UseGuards(BoardMemberGuard)
  async getDetail(@Request() req) {
    try {
      const board = await this.boardService.getDetail(req.board);
      return { data: board };
    } catch (error) {
      messageError(error);
    }
  }

  @Put('/:boardId')
  @UseGuards(BoardMemberGuard)
  async update(@Request() req, @Body() boardDTO: UpdateBoardDTO) {
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

  @Delete('/:boardId')
  async softDelete(@Request() req, @Param('boardId') boardId: string) {
    try {
      await this.boardService.softDelete(boardId);
      return {
        message: 'Soft Delete Board successfully',
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/restore/:boardId')
  async restore(@Request() req, @Param('boardId') boardId: string) {
    try {
      const result = await this.boardService.restore(boardId);
      return {
        message: 'Restore Board successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }
}
