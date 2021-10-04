import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwCanNotDeleteErr, throwSrvErr } from 'src/common/utils/error';
import { Label } from 'src/model/label/label.schema';
import { Task } from 'src/model/task/task.schema';
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

  async getList(queryDto: PaginationQueryDto) {
    try {
      const searchRegex = new RegExp(queryDto.search, 'i');
      const query = { name: { $regex: searchRegex } };
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
      const label = await this.checkIsLabelExist(labelId);
      label['tasks'] = await this.taskModel.find({ label: labelId });
      return label;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async delete(labelId: string) {
    try {
      await this.checkIsLabelExist(labelId);
      const relatedTasks = await this.taskModel.find({ label: labelId });
      if (relatedTasks.length > 0) throwCanNotDeleteErr('Label', 'Tasks');
      await this.labelModel.findByIdAndDelete(labelId);
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async update(labelId: string, labelDTO: UpdateLabelDTO) {
    try {
      const label = await this.labelModel.findByIdAndUpdate(labelId, labelDTO, {
        new: true,
      });
      if (!label) throw new NotFoundException('Label is not exist');
      return label;
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

  async checkIsLabelExist(labelId: string) {
    try {
      const label = await this.labelModel.findById(labelId).lean();
      if (!label) throw new NotFoundException('Label is not exist');
      return label;
    } catch (e) {
      throwSrvErr(e);
    }
  }
}
