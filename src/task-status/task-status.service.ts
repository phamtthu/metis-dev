import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwCanNotDeleteErr, errorException } from 'src/common/utils/error';
import { Task } from 'src/model/task/task.schema';
import { TaskStatus } from 'src/model/task-status/task-status.schema';
import { AddTaskStatusDTO } from './dto/add-task.dto';
import { UpdateTaskStatusDTO } from './dto/update-task.dto';
import { TaskStatusResponse } from './response/task-status-response';
import { paginator, toJsObject } from 'src/shared/helper';
import { classToPlain } from 'class-transformer';
import { TaskStatusesResponse } from './response/task-statuses-response';
import { TaskStatusDetailResponse } from './response/task-status-detail-response';

@Injectable()
export class TaskStatusService {
  constructor(
    @InjectModel('Task_Status')
    private taskStatusModel: PaginateModel<TaskStatus>,
    @InjectModel('Task') private taskModel: PaginateModel<Task>,
  ) {}

  async create(taskStatusDTO: AddTaskStatusDTO) {
    try {
      const taskStatus = await new this.taskStatusModel(taskStatusDTO).save();
      return classToPlain(new TaskStatusResponse(toJsObject(taskStatus)));
    } catch (error) {
      errorException(error);
    }
  }

  async getList(queryDto: PaginationQueryDto) {
    try {
      const searchRegex = new RegExp(queryDto.search, 'i');
      const query = {
        $or: [
          { name: { $regex: searchRegex } },
          { code: { $regex: searchRegex } },
        ],
      };
      if (queryDto.offset >= 0 && queryDto.limit >= 0) {
        const options = {
          offset: queryDto.offset,
          limit: queryDto.limit,
          sort: { created_at: SortQuery.Desc },
          customTaskStatuss: {
            page: 'page',
            limit: 'per_page',
            totalDocs: 'total',
            totalPages: 'total_pages',
            docs: 'data',
          },
        };
        const taskStatuses = await this.taskStatusModel.paginate(
          query,
          options,
        );
        return classToPlain(new TaskStatusesResponse(toJsObject(taskStatuses)));
      } else {
        const taskStatuses = await this.taskStatusModel
          .find(query)
          .sort({ created_at: SortQuery.Desc });
        return classToPlain(
          new TaskStatusesResponse(
            toJsObject(paginator(taskStatuses, 0, taskStatuses.length)),
          ),
        );
      }
    } catch (error) {
      errorException(error);
    }
  }

  async getDetail(taskStatusId: string) {
    try {
      await this.checkIsTaskStatusExist(taskStatusId);
      const taskStatus = await this.taskStatusModel
        .findById(taskStatusId)
        .lean();
      taskStatus['tasks'] = await this.taskModel.find({
        status: taskStatusId,
      });
      return classToPlain(new TaskStatusDetailResponse(toJsObject(taskStatus)));
    } catch (error) {
      errorException(error);
    }
  }

  async delete(taskStatusId: string) {
    try {
      await this.checkIsTaskStatusExist(taskStatusId);
      const relatedTasks = await this.taskModel.find({
        status: taskStatusId,
      });
      if (relatedTasks.length > 0) throwCanNotDeleteErr('Task Status', 'Task');
      await this.taskStatusModel.findByIdAndDelete(taskStatusId);
    } catch (error) {
      errorException(error);
    }
  }

  async update(taskStatusId: string, taskStatusDTO: UpdateTaskStatusDTO) {
    try {
      const taskStatus = await this.taskStatusModel.findByIdAndUpdate(
        taskStatusId,
        taskStatusDTO,
        { new: true },
      );
      if (!taskStatus) throw new NotFoundException('Task Status is not exist');
      return classToPlain(new TaskStatusResponse(toJsObject(taskStatus)));
    } catch (error) {
      errorException(error);
    }
  }

  async checkIsTaskStatusExist(taskStatusId: string) {
    try {
      const taskStatus = await this.taskStatusModel
        .findById(taskStatusId)
        .lean();
      if (!taskStatus) throw new NotFoundException('Task Status is not exist');
      return taskStatus;
    } catch (error) {
      errorException(error);
    }
  }
}
