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
  Query,
} from '@nestjs/common';
import { messageError } from 'src/common/utils/error';
import { TaskService } from './task.service';
import { AddTaskDto } from './dto/add-task.dto';
import { BoardMemberGuard } from 'src/auth/guard/board-members.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserTasksQueryDto } from './dto/user-tasks-query.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/common/enum/filter.enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Controller('api/task')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, BoardMemberGuard)
  @Roles(Role.Employee)
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

  // List Task Of User
  @Get('/user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee)
  async userTasksAssigned(
    @Request() req,
    @Query() userTasksDto: UserTasksQueryDto,
  ) {
    try {
      const result = await this.taskService.userTasksAssigned(
        req.user._id,
        userTasksDto,
      );
      return { result };
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/mark-or-unmark-done/:taskId')
  @UseGuards(JwtAuthGuard, RolesGuard, BoardMemberGuard)
  @Roles(Role.Employee)
  async markOrUnmarkDone(@Request() req, @Param('taskId') taskId: string) {
    try {
      const result = await this.taskService.markOrUnmarkDone(taskId);
      return {
        message: `${
          result.actual_end_date ? 'Mark done' : 'Unmark done'
        } Task successfully`,
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/:taskId')
  @UseGuards(JwtAuthGuard, RolesGuard, BoardMemberGuard)
  @Roles(Role.Employee)
  async getDetail(@Request() req, @Param('taskId') taskId: string) {
    try {
      const result = await this.taskService.getDetail(taskId);
      return { data: result };
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/deleted/board/:boardId')
  @UseGuards(JwtAuthGuard, RolesGuard, BoardMemberGuard)
  @Roles(Role.Employee)
  async getList(@Request() req, @Param('boardId') boardId: string) {
    try {
      const result = await this.taskService.getDeletedList(boardId);
      return result;
    } catch (error) {
      messageError(error);
    }
  }

  @Put('/:taskId')
  @UseGuards(JwtAuthGuard, RolesGuard, BoardMemberGuard)
  @Roles(Role.Employee)
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
  @UseGuards(JwtAuthGuard, RolesGuard, BoardMemberGuard)
  @Roles(Role.Employee)
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
  @UseGuards(JwtAuthGuard, BoardMemberGuard)
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
