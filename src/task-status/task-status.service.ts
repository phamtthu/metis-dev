import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwSrvErr } from 'src/common/utils/error';
import { Task } from 'src/model/task.schema';
import { TaskStatus } from 'src/model/taskstatuses.schema';
import { AddTaskStatusDTO } from './dto/add-task.dto';
import { UpdateTaskStatusDTO } from './dto/update-task.dto';

@Injectable()
export class TaskStatusService {
  constructor(
    @InjectModel('Task_Status')
    private taskStatusModel: PaginateModel<TaskStatus>,
    @InjectModel('Task') private taskModel: PaginateModel<Task>,
  ) {}

  async create(taskStatusDTO: AddTaskStatusDTO) {
    try {
      return await new this.taskStatusModel(taskStatusDTO).save();
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
          { code: { $regex: searchRegex } },
        ],
      };
      if (paginateQuery.offset >= 0 && paginateQuery.limit >= 0) {
        const options = {
          offset: paginateQuery.offset,
          limit: paginateQuery.limit,
          sort: { created_at: SortQuery.Desc },
          customTaskStatuss: {
            page: 'page',
            limit: 'per_page',
            totalDocs: 'total',
            totalPages: 'total_pages',
            docs: 'data',
          },
        };
        return await this.taskStatusModel.paginate(query, options);
      } else
        return await this.taskStatusModel
          .find(query)
          .sort({ created_at: SortQuery.Desc });
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getDetail(taskStatusId: string) {
    try {
      return await this.taskStatusModel.findById(taskStatusId);
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async delete(taskStatusId: string) {
    try {
      await this.taskStatusModel.findByIdAndDelete(taskStatusId);
      // Task
      await this.taskModel.updateMany(
        { status: taskStatusId },
        { status: null },
      );
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async update(taskStatusId: string, taskStatusDTO: UpdateTaskStatusDTO) {
    try {
      return await this.taskStatusModel.findByIdAndUpdate(
        taskStatusId,
        taskStatusDTO,
        { new: true },
      );
    } catch (error) {
      throwSrvErr(error);
    }
  }

  // async getTasksWithGivenTaskStatus(taskStatusId: string, paginateQuery: PaginationQueryDto) {
  //     try {
  //         const query = {
  //             taskStatus: taskStatusId
  //         }
  //         const populateOption = [
  //             { path: 'skill', model: 'Skill', select: 'name' },
  //             { path: 'product', model: 'Product', select: ['name', 'product_no'] }
  //         ]
  //         if (paginateQuery.offset >= 0 && paginateQuery.limit >= 0) {
  //             const options = {
  //                 offset: paginateQuery.offset,
  //                 limit: paginateQuery.limit,
  //                 sort: { created_at: SortQuery.Desc },
  //                 populate: populateOption,
  //                 customTaskStatuss: {
  //                     page: 'page',
  //                     limit: 'per_page',
  //                     totalDocs: 'total',
  //                     totalPages: 'total_pages',
  //                     docs: 'data'
  //                 }
  //             }
  //             return await this.taskModel.paginate(query, options)
  //         } else
  //             return await this.taskModel.find(query)
  //                 .populate(populateOption)
  //                 .sort({ 'created_at': SortQuery.Desc })
  //     } catch (error) { throwSrvErr(error) }
  // }
}
