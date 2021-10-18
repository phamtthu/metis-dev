import {
  Body,
  Delete,
  Post,
  Put,
  Query,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { messageError } from 'src/common/utils/error';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { TaskStatusService } from './task-status.service';
import { AddTaskStatusDTO } from './dto/add-task.dto';
import { UpdateTaskStatusDTO } from './dto/update-task.dto';

@Controller('api/task-status')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
export class TaskStatusController {
  constructor(private taskStatusService: TaskStatusService) {}

  @Post()
  async create(@Request() req, @Body() taskStatusDTO: AddTaskStatusDTO) {
    try {
      const result = await this.taskStatusService.create(taskStatusDTO);
      return {
        message: 'Create Task Status successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Get()
  async getList(@Request() req, @Query() queryDto: PaginationQueryDto) {
    try {
      const result = await this.taskStatusService.getList(queryDto);
      return result;
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/:taskStatusId')
  async getDetail(@Request() req, @Param('taskStatusId') taskStatusId: string) {
    try {
      const result = await this.taskStatusService.getDetail(taskStatusId);
      return { data: result };
    } catch (error) {
      messageError(error);
    }
  }

  @Delete('/:taskStatusId')
  async softDelete(
    @Request() req,
    @Param('taskStatusId') taskStatusId: string,
  ) {
    try {
      await this.taskStatusService.softDelete(taskStatusId);
      return {
        message: 'Soft Delete Task Status successfully',
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Get('restore/:taskStatusId')
  async restore(@Request() req, @Param('taskStatusId') taskStatusId: string) {
    try {
      const result = await this.taskStatusService.restore(taskStatusId);
      return {
        message: 'Restore Task Status successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Put('/:taskStatusId')
  async update(
    @Request() req,
    @Body() taskStatusDTO: UpdateTaskStatusDTO,
    @Param('taskStatusId') taskStatusId: string,
  ) {
    try {
      const result = await this.taskStatusService.update(
        taskStatusId,
        taskStatusDTO,
      );
      return {
        message: 'Update Task Status successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }
}
