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
import { throwCntrllrErr } from 'src/common/utils/error';
import { Request as ERequest } from 'express';
import { Response as EResponse } from 'express';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { TaskService } from './task.service';
import { AddTaskDTO } from './dto/add-task.dto';
import { getOriginURL } from 'src/shared/helper';
import { TaskID } from 'src/shared/pipe/taskId.pipe';
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
  async create(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Body() taskDTO: AddTaskDTO,
  ) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.taskService.create(taskDTO, originURL);
      return res.status(HttpStatus.CREATED).json({
        message: 'Create Task successfully',
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get()
  async getList(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Query('search') search: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    try {
      const result = await this.taskService.getList(
        { offset, limit },
        search?.trim(),
      );
      return res.status(HttpStatus.OK).json({
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get('/:taskId')
  async getDetail(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Param('taskId', TaskID) taskId: string,
  ) {
    try {
      const result = await this.taskService.getDetail(taskId);
      return res.status(HttpStatus.OK).json({
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Delete('/:taskId')
  async delete(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Param('taskId', TaskID) taskId: string,
  ) {
    try {
      await this.taskService.delete(taskId);
      return res.status(HttpStatus.OK).json({
        message: 'Delete Task successfully',
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Put('/:taskId')
  async update(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Body() taskDTO: UpdateTaskDTO,
    @Param('taskId', TaskID) taskId: string,
  ) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.taskService.update(taskId, taskDTO, originURL);
      return res.status(HttpStatus.OK).json({
        message: 'Update Task successfully',
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }
}
