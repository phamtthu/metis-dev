import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { SoftDeleteModel } from 'mongoose-delete';
import { TaskGroup } from 'src/model/task_group/task-group.schema';

@Injectable()
export class TaskStatusService {
  constructor(
    @InjectModel('Task_Status')
    private taskStatusModel: SoftDeleteModel<TaskStatus> &
      PaginateModel<TaskStatus>,
    @InjectModel('Task')
    private taskModel: PaginateModel<Task>,
    @InjectModel('Task_Group')
    private taskGroupModel: PaginateModel<TaskGroup> &
      SoftDeleteModel<TaskGroup>,
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
          customLabels: {
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

  async softDelete(taskStatusId: string) {
    try {
      const taskGroups = await this.taskGroupModel.find({
        status: taskStatusId,
      });
      if (taskGroups.length > 0)
        throwCanNotDeleteErr('Task Status', 'Task Group');
      const { n } = await this.taskStatusModel.deleteById(taskStatusId);
      if (n !== 1) throw new Error('Can not soft delete Task');
    } catch (error) {
      errorException(error);
    }
  }

  async restore(taskStatusId: string) {
    try {
      let taskStatus: any = await this.taskStatusModel.findById(taskStatusId);
      if (!taskStatus.deleted)
        throw new BadRequestException('Task Group is already restored');
      const { n } = await this.taskStatusModel.restore({ _id: taskStatusId });
      if (n !== 1) throw new Error('Can not restore Task');
      taskStatus = await this.taskStatusModel.findById(taskStatusId);
      return classToPlain(new TaskStatusResponse(toJsObject(taskStatus)));
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
