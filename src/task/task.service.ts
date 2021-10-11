import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
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
import { AddTaskDTO } from './dto/add-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { TaskUser } from 'src/model/task-user/taskuser.schema';
import { TaskResponse } from './response/task-response';
import { classToPlain } from 'class-transformer';
import { TasksResponse } from './response/tasks-response';
import { TaskDetailResponse } from './response/task-detail-response';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel('Task') private taskModel: PaginateModel<Task>,
    @InjectModel('User') private userModel: PaginateModel<User>,
    @InjectModel('Product') private productModel: PaginateModel<Product>,
    @InjectModel('Task_User') private taskUserModel: Model<TaskUser>,
  ) {}

  async create(taskDTO: AddTaskDTO, originURL: string) {
    try {
      const codes = (await this.taskModel.find()).map((e) => e.task_no);
      taskDTO.images = await Promise.all(
        taskDTO.images.map(
          async (img) => await getNewImgLink(img, 'task', originURL),
        ),
      );
      const task = await new this.taskModel({
        task_no: generateRandomCode(codes),
        ...taskDTO,
      }).save();
      await this.addTaskUsers(task._id, taskDTO.users);
      return classToPlain(new TaskResponse(toJsObject(task)));
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
          { task_no: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
        ],
      };
      const populateOption = [
        { path: 'status', model: 'Task_Status', select: 'name' },
        { path: 'skill', model: 'Skill', select: 'name' },
        { path: 'labels', model: 'Label', select: 'name' },
        {
          path: 'product',
          model: 'Product',
          select: ['name', 'product_no'],
        },
      ];
      if (queryDto.search) {
        const paginationOptions = {
          offset: queryDto.offset,
          limit: queryDto.limit,
          sort: { created_at: SortQuery.Desc },
          populate: populateOption,
          customLabels: {
            page: 'page',
            limit: 'per_page',
            totalDocs: 'total',
            totalPages: 'total_pages',
            docs: 'data',
          },
        };
        if (queryDto.offset >= 0 && queryDto.limit >= 0) {
          const tasks = await this.taskModel.paginate(query, paginationOptions);
          return classToPlain(new TasksResponse(toJsObject(tasks)));
        } else {
          const tasks = await this.taskModel
            .find(query)
            .populate(populateOption)
            .sort({ created_at: SortQuery.Desc });
          return classToPlain(
            new TasksResponse(toJsObject(paginator(tasks, 0, tasks.length))),
          );
        }
      } else {
        const tasks = await this.taskModel
          .find()
          .populate(populateOption)
          .sort({ created_at: SortQuery.Desc })
          .lean();
        const nestedTasks = getNestedList(null, tasks);
        if (queryDto.offset >= 0 && queryDto.limit >= 0) {
          return classToPlain(
            new TasksResponse(
              toJsObject(
                paginator(nestedTasks, queryDto.offset, queryDto.limit),
              ),
            ),
          );
        } else {
          return classToPlain(
            new TasksResponse(
              toJsObject(paginator(nestedTasks, 0, nestedTasks.length)),
            ),
          );
        }
      }
    } catch (error) {
      errorException(error);
    }
  }

  async getDetail(taskId: string) {
    try {
      const task = await this.checkIsTaskExist(taskId);
      const users = await this.taskUserModel
        .find({ task: taskId })
        .populate('user');
      task['users'] = users.map((e) => e.user);
      return classToPlain(new TaskDetailResponse(toJsObject(task)));
    } catch (error) {
      errorException(error);
    }
  }

  async delete(taskId: string) {
    try {
      const deletedTask = await this.taskModel.findByIdAndDelete(taskId);
      if (!deletedTask) throw new NotFoundException('Task is not exist');
      deletedTask.images.forEach(async (img) => {
        await deleteImgPath(img);
      });
      await this.taskUserModel.deleteMany({ task: taskId });
      await this.taskModel.updateMany({ parent: taskId }, { parent: null });
      await this.taskModel.updateMany({ pre_task: taskId }, { parent: null });
      await this.taskModel.updateMany({ after_task: taskId }, { parent: null });
    } catch (error) {
      errorException(error);
    }
  }

  async update(taskId: string, taskDTO: UpdateTaskDTO, originURL: string) {
    try {
      const oldTask = await this.checkIsTaskExist(taskId);
      oldTask.images.forEach(async (img) => {
        await deleteImgPath(img);
      });
      await this.taskUserModel.deleteMany({ task: taskId });
      await this.addTaskUsers(taskId, taskDTO.users);
      taskDTO.images = await Promise.all(
        taskDTO.images.map(
          async (img) => await getNewImgLink(img, 'task', originURL),
        ),
      );
      oldTask.images.forEach(async (img) => {
        await deleteImgPath(img);
      });
      const task = await this.taskModel.findByIdAndUpdate(taskId, taskDTO, {
        new: true,
      });
      return classToPlain(new TaskResponse(toJsObject(task)));
    } catch (error) {
      errorException(error);
    }
  }

  async checkIsTaskExist(taskId: string) {
    try {
      const task = await this.taskModel
        .findById(taskId)
        .populate([
          'product',
          'skill',
          'labels',
          'status',
          'product_workcenter',
        ])
        .lean();
      if (!task) throw new NotFoundException('Task is not exist');
      return task;
    } catch (error) {
      errorException(error);
    }
  }

  async addTaskUsers(taskId: string, userIds: string[]) {
    try {
      const taskUsers = userIds.map((userId) => ({
        task: taskId,
        user: userId,
      }));
      await this.taskUserModel.insertMany(taskUsers);
    } catch (error) {
      errorException(error);
    }
  }
}
