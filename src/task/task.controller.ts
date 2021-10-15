import {
  Body,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Controller,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { messageError } from 'src/common/utils/error';
import { TaskService } from './task.service';
import { AddTaskDto } from './dto/add-task.dto';
import { BoardMemberGuard } from 'src/auth/guard/board-members.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('api/task')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
@UseGuards(JwtAuthGuard, BoardMemberGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  async create(@Request() req, @Body() taskDto: AddTaskDto) {
    try {
      const result = await this.taskService.create(taskDto, req.user._id);
      return {
        message: 'Create Task successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/:taskId')
  async getDetail(@Request() req, @Param('taskId') taskId: string) {
    try {
      const result = await this.taskService.getDetail(taskId);
      return { data: result };
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/deleted/board/:boardId')
  async getList(@Request() req, @Param('boardId') boardId: string) {
    try {
      const result = await this.taskService.getDeletedList(boardId);
      return result;
    } catch (error) {
      messageError(error);
    }
  }

  @Put('/:taskId')
  async update(
    @Request() req,
    @Body() taskDto: UpdateTaskDto,
    @Param('taskId') taskId: string,
  ) {
    try {
      const result = await this.taskService.update(taskId, taskDto);
      return {
        message: 'Update Task successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Delete('/:taskId')
  async softDelete(@Request() req, @Param('taskId') taskId: string) {
    try {
      await this.taskService.softDelete(taskId);
      return {
        message: 'Soft Delete Task successfully',
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Get('restore/:taskId')
  async restore(@Request() req, @Param('taskId') taskId: string) {
    try {
      const result = await this.taskService.restore(taskId);
      return {
        message: 'Restore Task successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }
}
