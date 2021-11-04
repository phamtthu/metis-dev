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
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/common/enum/filter.enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';

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

  // List Board in which User is member
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.Employee)
  async getList(@Request() req) {
    try {
      const result = await this.boardService.getList(req.user._id);
      return result;
    } catch (error) {
      messageError(error);
    }
  }

  // Boards - Working time statistics(h)
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
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
  @UseGuards(RolesGuard, BoardMemberGuard)
  @Roles(Role.Employee)
  async getDetail(@Request() req) {
    try {
      const board = await this.boardService.getDetail(req.board);
      return { data: board };
    } catch (error) {
      messageError(error);
    }
  }

  @Put('/:boardId')
  @UseGuards(RolesGuard, BoardMemberGuard)
  @Roles(Role.Employee)
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
  @UseGuards(RolesGuard, BoardMemberGuard)
  @Roles(Role.Employee)
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
  @UseGuards(RolesGuard, BoardMemberGuard)
  @Roles(Role.Employee)
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
