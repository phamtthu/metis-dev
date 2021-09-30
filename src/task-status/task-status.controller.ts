import {
  Body,
  Delete,
  HttpStatus,
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
import { TaskStatusId } from 'src/shared/pipe/task-status-id.pipe';
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
  async create(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Body() taskStatusDTO: AddTaskStatusDTO,
  ) {
    try {
      const result = await this.taskStatusService.create(taskStatusDTO);
      return res.status(HttpStatus.CREATED).json({
        message: 'Create TaskStatus successfully',
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
      const result = await this.taskStatusService.getList(
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

  // @Get('task/:taskStatusId')
  // async getTasksWithGivenTaskStatus(
  //     @Request() req: ERequest,
  //     @Response() res: EResponse,
  //     @Param('taskStatusId', TaskStatusID) taskStatusId: string,
  //     @Query() paginateQuery: PaginationQueryDto
  // ) {
  //     try {
  //         const result = await this.taskStatusService.getTasksWithGivenTaskStatus(
  //             taskStatusId, paginateQuery)
  //         return res.status(HttpStatus.OK).json({
  //             data: result
  //         })
  //     } catch (error) { throwCntrllrErr(error) }
  // }

  @Get('/:taskStatusId')
  async getDetail(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Param('taskStatusId', TaskStatusId) taskStatusId: string,
  ) {
    try {
      const result = await this.taskStatusService.getDetail(taskStatusId);
      return res.status(HttpStatus.OK).json({
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Delete('/:taskStatusId')
  async delete(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Param('taskStatusId', TaskStatusId) taskStatusId: string,
  ) {
    try {
      await this.taskStatusService.delete(taskStatusId);
      return res.status(HttpStatus.OK).json({
        message: 'Delete Task Status successfully',
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Put('/:taskStatusId')
  async update(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Body() taskStatusDTO: UpdateTaskStatusDTO,
    @Param('taskStatusId', TaskStatusId) taskStatusId: string,
  ) {
    try {
      const result = await this.taskStatusService.update(
        taskStatusId,
        taskStatusDTO,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Update Task Status successfully',
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }
}
