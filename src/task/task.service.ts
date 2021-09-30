import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwSrvErr } from 'src/common/utils/error';
import { deleteImgPath, getNewImgLink } from 'src/common/utils/image-handler';
import { User } from 'src/model/user.shema';
import { Product } from 'src/model/product.schema';
import { Task } from 'src/model/task.schema';
import { getNestedList, isTwoArrayEqual, paginator } from 'src/shared/helper';
import { AddTaskDTO } from './dto/add-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { TaskUser } from 'src/model/taskuser.schema';

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
      const result = await this.taskModel.findOne({ task_no: taskDTO.task_no });
      if (result) throw new ConflictException('task_no is already exist');

      taskDTO.images = await Promise.all(
        taskDTO.images.map(
          async (img) => await getNewImgLink(img, 'task', originURL),
        ),
      );

      const task = await new this.taskModel(taskDTO).save();

      // Product
      await this.productModel.findByIdAndUpdate(taskDTO.product, {
        $push: { tasks: task._id },
      });
      // User
      for await (const userId of taskDTO.users) {
        await new this.taskUserModel({
          user: userId,
          task: task._id,
        }).save();
      }
      return task;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getList(paginateQuery: PaginationQueryDto, search: string) {
    try {
      const searchRegex = new RegExp(search, 'i');
      const query = {
        $or: [
          { name: { $regex: searchRegex } },
          { task_no: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
        ],
      };
      const populateOption = [
        { path: 'status', model: 'TaskStatus', select: 'name' },
        { path: 'skill', model: 'Skill', select: 'name' },
        { path: 'labels', model: 'Label', select: 'name' },
        { path: 'product', model: 'Product', select: ['name', 'product_no'] },
      ];
      if (search) {
        const paginationOptions = {
          offset: paginateQuery.offset,
          limit: paginateQuery.limit,
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
        if (paginateQuery.offset >= 0 && paginateQuery.limit >= 0) {
          const tasks = await this.taskModel.paginate(query, paginationOptions);
          return tasks;
        } else {
          return await this.taskModel
            .find(query)
            .populate(populateOption)
            .sort({ created_at: SortQuery.Desc });
        }
      } else {
        const tasks = await this.taskModel
          .find()
          .populate(populateOption)
          .sort({ created_at: SortQuery.Desc })
          .lean();
        const nestedTasks = getNestedList(null, tasks);
        if (paginateQuery.offset >= 0 && paginateQuery.limit >= 0) {
          return paginator(
            nestedTasks,
            paginateQuery.offset,
            paginateQuery.limit,
          );
        } else {
          return nestedTasks;
        }
      }
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getDetail(taskId: string) {
    try {
      const task = await this.taskModel
        .findById(taskId)
        .populate(['product', 'skill', 'labels', 'users', 'status']);
      return task;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async delete(taskId: string) {
    try {
      const deletedTask = await this.taskModel.findByIdAndDelete(taskId);
      deletedTask.images.forEach(async (img) => {
        await deleteImgPath(img);
      });
      // Product
      await this.productModel.findByIdAndUpdate(deletedTask.product, {
        $pull: { tasks: taskId },
      });
      // Task User
      await this.taskUserModel.deleteMany({ task: taskId });
      // Task
      await this.taskModel.updateMany({ parent: taskId }, { parent: null });
      await this.taskModel.updateMany({ pre_task: taskId }, { parent: null });
      await this.taskModel.updateMany({ after_task: taskId }, { parent: null });
      return deletedTask;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async update(taskId: string, taskDTO: UpdateTaskDTO, originURL: string) {
    try {
      const oldTask = await this.taskModel.findById(taskId).lean();
      oldTask.images.forEach(async (img) => {
        await deleteImgPath(img);
      });
      taskDTO.images = await Promise.all(
        taskDTO.images.map(
          async (img) => await getNewImgLink(img, 'task', originURL),
        ),
      );
      // Product
      if (String(oldTask.product) !== taskDTO.product) {
        await this.productModel.findByIdAndUpdate(oldTask.product, {
          $pull: { tasks: taskId },
        });
        await this.productModel.findByIdAndUpdate(taskDTO.product, {
          $push: { tasks: taskId },
        });
      }
      // Users
      // if (!isTwoArrayEqual(taskDTO.users, oldTask.users.map(e => String(e)))) {
      //     await this.userModel.updateMany(
      //         { _id: { "$in": oldTask.users } },
      //         { $pull: { tasks: taskId } }
      //     )
      //     await this.userModel.updateMany(
      //         { _id: { "$in": taskDTO.users } },
      //         { $push: { tasks: taskId } }
      //     )
      // }
      return await this.taskModel.findByIdAndUpdate(taskId, taskDTO, {
        new: true,
      });
    } catch (error) {
      throwSrvErr(error);
    }
  }
}
