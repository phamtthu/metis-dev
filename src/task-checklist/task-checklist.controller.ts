import {
  Body,
  Delete,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { messageError } from 'src/common/utils/error';
import { TaskChecklistService } from './task-checklist.service';
import { AddTaskChecklistDto } from './dto/add-task-checklist.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { BoardMemberGuard } from 'src/auth/guard/board-members.guard';
import { UpdateTaskChecklistDto } from './dto/update-task-checklist.dto';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/common/enum/filter.enum';

@Controller('api/task-checklist')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
@UseGuards(JwtAuthGuard, RolesGuard, BoardMemberGuard)
@Roles(Role.Employee)
export class TaskChecklistController {
  constructor(private taskChecklistService: TaskChecklistService) {}

  @Post()
  async create(@Request() req, @Body() taskChecklistDto: AddTaskChecklistDto) {
    try {
      const result = await this.taskChecklistService.create(
        taskChecklistDto,
        req.user._id,
      );
      return {
        message: 'Create Task Checklist successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Delete('/:taskChecklistId')
  async softDelete(
    @Request() req,
    @Param('taskChecklistId') taskChecklistId: string,
  ) {
    try {
      await this.taskChecklistService.softDelete(taskChecklistId);
      return {
        message: 'Soft Delete Task Checklist successfully',
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Get('restore/:taskChecklistId')
  async restore(
    @Request() req,
    @Param('taskChecklistId') taskChecklistId: string,
  ) {
    try {
      const result = await this.taskChecklistService.restore(taskChecklistId);
      return {
        message: 'Restore Task Checklist successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Put('/:taskChecklistId')
  async update(
    @Request() req,
    @Body() taskChecklistDto: UpdateTaskChecklistDto,
    @Param('taskChecklistId') taskChecklistId: string,
  ) {
    try {
      const result = await this.taskChecklistService.update(
        taskChecklistId,
        taskChecklistDto,
      );
      return {
        message: 'Update Task Checklist successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }
}
