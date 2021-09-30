import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwSrvErr } from 'src/common/utils/error';
import { Label } from 'src/model/label.schema';
import { Task } from 'src/model/task.schema';
import { AddLabelDTO } from './dto/add-label.dto';
import { UpdateLabelDTO } from './dto/update-label.dto';

@Injectable()
export class LabelService {
  constructor(
    @InjectModel('Label') private labelModel: PaginateModel<Label>,
    @InjectModel('Task') private taskModel: PaginateModel<Task>,
  ) {}

  async create(labelDTO: AddLabelDTO) {
    try {
      return await new this.labelModel(labelDTO).save();
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getList(paginateQuery: PaginationQueryDto, search: string) {
    try {
      const searchRegex = new RegExp(search, 'i');
      const query = { name: { $regex: searchRegex } };
      if (paginateQuery.offset >= 0 && paginateQuery.limit >= 0) {
        const options = {
          offset: paginateQuery.offset,
          limit: paginateQuery.limit,
          sort: { created_at: SortQuery.Desc },
          customLabels: {
            page: 'page',
            limit: 'per_page',
            totalDocs: 'total',
            totalPages: 'total_pages',
            docs: 'data',
          },
        };
        return await this.labelModel.paginate(query, options);
      } else
        return await this.labelModel
          .find(query)
          .sort({ created_at: SortQuery.Desc });
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getDetail(labelId: string) {
    try {
      return await this.labelModel.findById(labelId);
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async delete(labelId: string) {
    try {
      await this.labelModel.findByIdAndDelete(labelId);
      // Task
      await this.taskModel.updateMany(
        { labels: labelId },
        { $pull: { labels: labelId } },
      );
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async update(labelId: string, labelDTO: UpdateLabelDTO) {
    try {
      return await this.labelModel.findByIdAndUpdate(labelId, labelDTO, {
        new: true,
      });
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getTasksWithGivenLabel(
    labelId: string,
    paginateQuery: PaginationQueryDto,
  ) {
    try {
      const query = {
        label: labelId,
      };
      const populateOption = [
        { path: 'skill', model: 'Skill', select: 'name' },
        { path: 'product', model: 'Product', select: ['name', 'product_no'] },
      ];
      if (paginateQuery.offset >= 0 && paginateQuery.limit >= 0) {
        const options = {
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
        return await this.taskModel.paginate(query, options);
      } else
        return await this.taskModel
          .find(query)
          .populate(populateOption)
          .sort({ created_at: SortQuery.Desc });
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async findAllIds() {
    try {
      const labels = await this.labelModel.find().lean();
      return labels.map((label) => String(label._id));
    } catch (e) {
      throwSrvErr(e);
    }
  }
}
