import {
  Body,
  Delete,
  HttpStatus,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  Response,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { messageError } from 'src/common/utils/error';

import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { TaskService } from './task.service';
import { AddTaskDTO } from './dto/add-task.dto';
import { getOriginURL } from 'src/shared/helper';
import { UpdateTaskDTO } from './dto/update-task.dto';

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
  async create(@Request() req, @Body() taskDTO: AddTaskDTO) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.taskService.create(taskDTO, originURL);
      return {
        message: 'Create Task successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Get()
  async getList(@Request() req, @Query() queryDto: PaginationQueryDto) {
    try {
      const result = await this.taskService.getList(queryDto);
      return result;
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

  @Delete('/:taskId')
  async delete(@Request() req, @Param('taskId') taskId: string) {
    try {
      await this.taskService.delete(taskId);
      return {
        message: 'Delete Task successfully',
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Put('/:taskId')
  async update(
    @Request() req,
    @Body() taskDTO: UpdateTaskDTO,
    @Param('taskId') taskId: string,
  ) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.taskService.update(taskId, taskDTO, originURL);
      return {
        message: 'Update Task successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }
}
