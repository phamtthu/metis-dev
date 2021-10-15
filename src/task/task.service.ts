import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery, Status } from 'src/common/enum/filter.enum';
import { errorException } from 'src/common/utils/error';
import { deleteImgPath, getNewImgLink } from 'src/common/utils/image-handler';
import { User } from 'src/model/user/user.shema';
import { Product } from 'src/model/product/product.schema';
import { Task } from 'src/model/task/task.schema';
import {
  generateRandomCode,
  getNestedList,
  paginator,
  toJsObject,
} from 'src/shared/helper';
import { AddTaskDto } from './dto/add-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskUser } from 'src/model/task-user/taskuser.schema';
import { TaskResponse } from './response/task-response';
import { classToPlain } from 'class-transformer';
import { TasksResponse } from './response/tasks-response';
import { TaskDetailResponse } from './response/task-detail-response';
import { TaskGroup } from 'src/model/task_group/task-group.schema';
import { TaskStatus } from 'src/model/task-status/task-status.schema';
import { ProductWorkCenter } from 'src/model/product-workcenter/product-workcenter.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import { TaskUserResponse } from './response/task-user-response';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel('Task')
    private taskModel: PaginateModel<Task> & SoftDeleteModel<Task>,
    @InjectModel('Task_Group')
    private taskGroupModel: PaginateModel<TaskGroup>,
    @InjectModel('Task_Status')
    private taskStatusModel: PaginateModel<TaskStatus>,
    @InjectModel('User')
    private userModel: PaginateModel<User>,
    @InjectModel('Product')
    private productModel: PaginateModel<Product>,
    @InjectModel('Task_User')
    private taskUserModel: Model<TaskUser>,
    @InjectModel('Product_WorkCenter')
    private productWorkCenterModel: Model<ProductWorkCenter>,
  ) {}

  async create(taskDto: AddTaskDto, userId: string) {
    try {
      const taskGroup = await this.taskGroupModel.findById(taskDto.task_group);
      if (String(taskGroup.board) !== taskDto.board)
        throw new BadRequestException('Task Group is not belong to this Board');
      const codes = (await this.taskModel.find()).map((e) => e.task_no);
      const tasks = await this.taskModel.find({
        task_group: taskDto.task_group,
      });
      const index =
        tasks.length > 0 ? Math.max(...tasks.map((task) => task.index)) + 1 : 0;
      const newTask = await new this.taskModel({
        created_by: userId,
        task_no: generateRandomCode(codes),
        index: index,
        ...taskDto,
      }).save();
      return classToPlain(new TaskResponse(toJsObject(newTask)));
    } catch (error) {
      errorException(error);
    }
  }

  async getDetail(taskId: string) {
    try {
      const task = await this.checkTaskExist(taskId);
      return classToPlain(new TaskResponse(toJsObject(task)));
    } catch (error) {
      errorException(error);
    }
  }

  async getDeletedList(boardId: string) {
    try {
      const deletedTasks = await this.taskModel.findDeleted();
      const deletedTasksOfGivenBoard = deletedTasks.map(
        (task) => boardId === String(task.board),
      );
      return classToPlain(
        new TasksResponse(
          toJsObject(
            paginator(
              deletedTasksOfGivenBoard,
              0,
              deletedTasksOfGivenBoard.length,
            ),
          ),
        ),
      );
    } catch (error) {
      errorException(error);
    }
  }

  async softDelete(taskId: string) {
    try {
      const { n } = await this.taskModel.deleteById(taskId);
      if (n === 1) {
        await this.taskModel.findByIdAndUpdate(taskId, { index: null });
      } else {
        throw new Error('Can not soft delete Task');
      }
    } catch (error) {
      errorException(error);
    }
  }

  async restore(taskId: string) {
    try {
      let task: any = await this.taskModel.findById(taskId);
      if (!task.deleted)
        throw new BadRequestException('Task is already restored');
      const { n } = await this.taskModel.restore({ _id: taskId });
      if (n === 1) {
        const tasks = await this.taskModel.find({
          task_group: task.task_group,
        });
        const index = tasks.length > 0 ? tasks[0].index + 1 : 0;
        task = await this.taskModel.findByIdAndUpdate(
          taskId,
          { index: index },
          { new: true },
        );
        return classToPlain(new TaskResponse(toJsObject(task)));
      } else {
        throw new Error('Can not restore Task');
      }
    } catch (error) {
      errorException(error);
    }
  }

  async update(taskId: string, taskDto: UpdateTaskDto) {
    try {
      // User
      if (Array.isArray(taskDto.users)) {
        const currentUserIds = (
          await this.taskUserModel.find({ task: taskId })
        ).map((e) => String(e.user));
        const inUserIds = taskDto.users.filter(
          (userId) => !currentUserIds.includes(userId),
        );
        const outUsers = currentUserIds.filter(
          (userId) => !taskDto.users.includes(userId),
        );
        await this.taskUserModel.deleteMany({
          task: taskId,
          user: { $in: outUsers },
        });
        await this.taskUserModel.insertMany(
          inUserIds.map((userId) => ({ task: taskId, user: userId })),
        );
        // User to Product Workcenter
        const { board } = await this.taskModel.findById(taskId);
        const productWorkCenter = await this.productWorkCenterModel.findOne({
          board: board,
        });
        const inUserIdsToProductWC = inUserIds.filter(
          (userId) => !productWorkCenter.users.includes(userId),
        );
        productWorkCenter.users.push(...inUserIdsToProductWC);
        await productWorkCenter.save();
        const taskUsers = await this.taskUserModel.find({ task: taskId });
        return taskUsers.map((e) => {
          return classToPlain(new TaskUserResponse(toJsObject(e)));
        });
      } // Labels
      else if (Array.isArray(taskDto.labels)) {
        const task = await this.taskModel.findByIdAndUpdate(
          taskId,
          {
            labels: taskDto.labels,
          },
          { new: true },
        );
        return classToPlain(new TaskResponse(toJsObject(task)));
      } else if (Object.keys(taskDto).length === 1 && taskDto.task_group) {
        // Same Board, different TaskGroup
        const tasks = await this.taskModel
          .find({ task_group: taskDto.task_group })
          .sort({ index: SortQuery.Desc });
        const index = tasks.length > 0 ? tasks[0].index + 1 : 0;
        const newTask = await this.taskModel.findByIdAndUpdate(
          taskId,
          { index: index, task_group: taskDto.task_group },
          { new: true },
        );
        return classToPlain(new TaskResponse(toJsObject(newTask)));
      } else if (
        taskDto.board &&
        taskDto.task_group &&
        typeof taskDto.index === 'number'
      ) {
        const { board } = await this.taskGroupModel.findById(
          taskDto.task_group,
        );
        if (String(board) !== taskDto.board)
          throw new BadRequestException(
            'Task group is not belong to this Board',
          );
        const currentTask = await this.taskModel.findById(taskId).lean();
        // Different Board, with index
        if (taskDto.board !== String(currentTask.board)) {
          const tasks = await this.taskModel
            .find({
              task_group: taskDto.task_group,
            })
            .sort({ index: SortQuery.Desc });
          const isInvalidIndex =
            taskDto.index < 0 || taskDto.index > tasks[0].index;
          if (isInvalidIndex)
            throw new BadRequestException('Index is out of range');
          const newTask = await this.taskModel.findByIdAndUpdate(
            taskId,
            taskDto,
            { new: true },
          );
          await this.taskModel.updateMany(
            {
              task_group: currentTask.task_group,
              index: { $gt: taskDto.index },
            },
            { $inc: { index: -1 } },
          );
          await this.taskModel.updateMany(
            {
              task_group: taskDto.task_group,
              index: { $gte: taskDto.index },
              _id: { $ne: newTask._id },
            },
            { $inc: { index: +1 } },
          );
          return classToPlain(new TaskResponse(toJsObject(newTask)));
        } // Same Board, different Task_Group, with index
        else if (taskDto.task_group !== String(currentTask.task_group)) {
          const tasks = await this.taskModel
            .find({
              task_group: taskDto.task_group,
            })
            .sort({ index: SortQuery.Desc });
          const isInvalidIndex =
            taskDto.index < 0 || taskDto.index > tasks[0].index;
          if (isInvalidIndex)
            throw new BadRequestException('Index is out of range');
          const newTask = await this.taskModel.findByIdAndUpdate(
            taskId,
            taskDto,
            { new: true },
          );
          await this.taskModel.updateMany(
            {
              task_group: currentTask.task_group,
              index: { $gt: currentTask.index },
            },
            { $inc: { index: -1 } },
          );
          await this.taskModel.updateMany(
            {
              task_group: taskDto.task_group,
              index: { $gte: taskDto.index },
              _id: { $ne: newTask._id },
            },
            { $inc: { index: +1 } },
          );
          return classToPlain(new TaskResponse(toJsObject(newTask)));
        } // Same Board,Same Task Group with index
        else if (taskDto.task_group === String(currentTask.task_group)) {
          const tasks = await this.taskModel
            .find({ task_group: taskDto.task_group })
            .sort({ index: SortQuery.Desc });
          const isInvalidIndex =
            taskDto.index < 0 || taskDto.index > tasks[0].index;
          if (isInvalidIndex)
            throw new BadRequestException('Index is out of range');
          const newTask = await this.taskModel.findByIdAndUpdate(
            taskId,
            taskDto,
            { new: true },
          );
          if (taskDto.index >= currentTask.index) {
            await this.taskModel.updateMany(
              {
                task_group: taskDto.task_group,
                index: { $gt: currentTask.index, $lte: taskDto.index },
                _id: { $ne: newTask._id },
              },
              { $inc: { index: -1 } },
            );
          } else {
            await this.taskModel.updateMany(
              {
                task_group: taskDto.task_group,
                index: { $gte: taskDto.index, $lt: currentTask.index },
                _id: { $ne: newTask._id },
              },
              { $inc: { index: +1 } },
            );
          }
          return classToPlain(new TaskResponse(toJsObject(newTask)));
        }
      } else if (!taskDto.board && !taskDto.task_group && !taskDto.index) {
        const newTask = await this.taskModel.findByIdAndUpdate(
          taskId,
          taskDto,
          { new: true },
        );
        return classToPlain(new TaskResponse(toJsObject(newTask)));
      } else {
        throw new BadRequestException('Input is invalid');
      }
    } catch (error) {
      errorException(error);
    }
  }

  async checkTaskExist(taskId: string) {
    try {
      const task = await this.taskModel
        .findById(taskId)
        .populate([
          { path: 'labels', select: '_id name', model: 'Label' },
          {
            path: 'task_group',
            select: '_id name cover_background',
            model: 'Task_Group',
          },
          { path: 'created_by', select: '_id name email', model: 'User' },
        ])
        .lean();
      if (!task) throw new NotFoundException('Task is not exist');
      return task;
    } catch (error) {
      errorException(error);
    }
  }
}
