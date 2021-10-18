import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { classToPlain } from 'class-transformer';
import { Model, PaginateModel } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { errorException } from 'src/common/utils/error';
import { TaskChecklist } from 'src/model/task-checklist/task-checklist.schema';
import { toJsObject } from 'src/shared/helper';
import { AddTaskChecklistDto } from './dto/add-task-checklist.dto';
import { UpdateTaskChecklistDto } from './dto/update-task-checklist.dto';
import { TaskChecklistResponse } from './response/task-checklist-response';

@Injectable()
export class TaskChecklistService {
  constructor(
    @InjectModel('Task_Checklist')
    private taskChecklistModel: PaginateModel<TaskChecklist> &
      SoftDeleteModel<TaskChecklist>,
  ) {}

  async getIndex(taskChecklistId: string) {
    let index;
    const taskCheclists = await this.taskChecklistModel.find({
      task: taskChecklistId,
    });
    if (taskCheclists.length === 0) {
      index = 0;
      return index;
    }
    const largestTaskIndex = Math.max(
      ...taskCheclists.map((taskChecklist) => taskChecklist.index),
    );
    index = largestTaskIndex + 1;
    return index;
  }

  async create(taskChecklistDto: AddTaskChecklistDto, userId: string) {
    try {
      const index = await this.getIndex(taskChecklistDto.task);
      const taskChecklist = await new this.taskChecklistModel({
        created_by: userId,
        index: index,
        ...taskChecklistDto,
      }).save();
      return classToPlain(new TaskChecklistResponse(toJsObject(taskChecklist)));
    } catch (error) {
      errorException(error);
    }
  }

  async softDelete(taskChecklistId: string) {
    try {
      const { n } = await this.taskChecklistModel.deleteById(taskChecklistId);
      if (n === 1) {
        const taskChecklist = await this.taskChecklistModel.findByIdAndUpdate(
          taskChecklistId,
          {
            index: null,
          },
        );
        await this.taskChecklistModel.updateMany(
          { task: taskChecklist.task, index: { $gt: taskChecklist.index } },
          { $inc: { index: -1 } },
        );
      } else {
        throw new Error('Can not soft delete Task');
      }
    } catch (error) {
      errorException(error);
    }
  }

  async restore(taskChecklistId: string) {
    try {
      let taskChecklist: any = await this.taskChecklistModel.findById(
        taskChecklistId,
      );
      if (!taskChecklist.deleted)
        throw new BadRequestException('Task Checklist is already restored');
      const { n } = await this.taskChecklistModel.restore({
        _id: taskChecklistId,
      });
      if (n === 1) {
        taskChecklist = await this.taskChecklistModel.findByIdAndUpdate(
          taskChecklistId,
          { index: await this.getIndex(taskChecklist.task) },
          { new: true },
        );
        return classToPlain(
          new TaskChecklistResponse(toJsObject(taskChecklist)),
        );
      } else {
        throw new Error('Can not restore Task Checklist');
      }
    } catch (error) {
      errorException(error);
    }
  }

  async update(
    taskChecklistId: string,
    taskChecklistDto: UpdateTaskChecklistDto,
  ) {
    try {
      if (
        Object.keys(taskChecklistDto).length === 1 &&
        typeof taskChecklistDto.index === 'number'
      ) {
        const taskChecklist = await this.findTaskChecklistById(taskChecklistId);
        const isInValidIndex =
          taskChecklistDto.index < 0 ||
          taskChecklistDto.index >
            (await this.getIndex(taskChecklist.task)) - 1;
        if (isInValidIndex)
          throw new BadRequestException('Index is out of range');
        const newTaskChecklist =
          await this.taskChecklistModel.findByIdAndUpdate(
            taskChecklistId,
            taskChecklistDto,
            { new: true },
          );
        if (taskChecklistDto.index >= taskChecklist.index) {
          await this.taskChecklistModel.updateMany(
            {
              task: taskChecklist.task,
              index: {
                $gt: taskChecklist.index,
                $lte: taskChecklistDto.index,
              },
              _id: { $ne: taskChecklistId },
            },
            { $inc: { index: -1 } },
          );
        } else {
          await this.taskChecklistModel.updateMany(
            {
              task: taskChecklist.task,
              index: {
                $gte: taskChecklistDto.index,
                $lt: taskChecklist.index,
              },
              _id: { $ne: taskChecklistId },
            },
            { $inc: { index: +1 } },
          );
        }
        return classToPlain(
          new TaskChecklistResponse(toJsObject(newTaskChecklist)),
        );
      } else if (taskChecklistDto.index == null) {
        const newTaskChecklist =
          await this.taskChecklistModel.findByIdAndUpdate(
            taskChecklistId,
            taskChecklistDto,
            { new: true },
          );
        return classToPlain(
          new TaskChecklistResponse(toJsObject(newTaskChecklist)),
        );
      } else {
        throw new BadRequestException('Input is invalid');
      }
    } catch (error) {
      errorException(error);
    }
  }

  async findTaskChecklistById(taskChecklistId: string) {
    try {
      const taskChecklist = await this.taskChecklistModel
        .findById(taskChecklistId)
        .populate('task')
        .lean();
      if (!taskChecklist)
        throw new NotFoundException('Task Checklist is not exist');
      return taskChecklist;
    } catch (error) {
      errorException(error);
    }
  }
}
