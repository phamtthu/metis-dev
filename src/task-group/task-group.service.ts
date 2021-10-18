import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { classToPlain } from 'class-transformer';
import { Model, PaginateModel } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { errorException } from 'src/common/utils/error';
import { TaskGroup } from 'src/model/task_group/task-group.schema';
import { toJsObject } from 'src/shared/helper';
import { AddTaskGroupDto } from './dto/add-task-group.dto';
import { UpdateTaskGroupDto } from './dto/update-task-group.dto';
import { TaskGroupResponse } from './response/task-group-response.dto';
import { TaskStatus } from 'src/model/task-status/task-status.schema';

@Injectable()
export class TaskGroupService {
  constructor(
    @InjectModel('Task_Group')
    private taskGroupModel: Model<TaskGroup> & SoftDeleteModel<TaskGroup>,
    @InjectModel('Task_Status')
    private taskStatusModel: Model<TaskStatus>,
  ) {}

  async create(taskGroupDto: AddTaskGroupDto) {
    try {
      const taskGroup = await this.taskGroupModel.find({
        status: taskGroupDto.status,
        board: taskGroupDto.board,
      });
      if (taskGroup.length > 0)
        throw new BadRequestException(
          "There's already a Task Group related to this Status",
        );
      if (taskGroupDto.name == null) {
        const taskStatus = await this.taskStatusModel.findById(
          taskGroupDto.status,
        );
        taskGroupDto.name = `${taskStatus.name} - Group`;
      }
      const newTaskGroup = await new this.taskGroupModel(taskGroupDto).save();
      return classToPlain(new TaskGroupResponse(toJsObject(newTaskGroup)));
    } catch (error) {
      errorException(error);
    }
  }

  async update(taskGroupId: string, taskGroupDto: UpdateTaskGroupDto) {
    try {
      const taskGroup = await this.taskGroupModel.findByIdAndUpdate(
        taskGroupId,
        taskGroupDto,
        { new: true },
      );
      return classToPlain(new TaskGroupResponse(toJsObject(taskGroup)));
    } catch (error) {
      errorException(error);
    }
  }

  async findTaskGroupById(taskGroupId: string) {
    try {
      const taskGroup = await this.taskGroupModel.findById(taskGroupId).lean();
      if (!taskGroup) throw new NotFoundException('Task Group is not exist');
      return taskGroup;
    } catch (error) {
      errorException(error);
    }
  }

  async softDelete(taskGroupId: string) {
    try {
      const { n } = await this.taskGroupModel.deleteById(taskGroupId);
      if (n !== 1) throw new Error('Can not soft delete Task');
    } catch (error) {
      errorException(error);
    }
  }

  async restore(taskGroupId: string) {
    try {
      let taskGroup: any = await this.taskGroupModel.findById(taskGroupId);
      if (!taskGroup.deleted)
        throw new BadRequestException('Task Group is already restored');
      const { n } = await this.taskGroupModel.restore({ _id: taskGroupId });
      if (n !== 1) throw new Error('Can not restore Task');
      taskGroup = await this.taskGroupModel.findById(taskGroupId);
      return classToPlain(new TaskGroupResponse(toJsObject(taskGroup)));
    } catch (error) {
      errorException(error);
    }
  }
}
