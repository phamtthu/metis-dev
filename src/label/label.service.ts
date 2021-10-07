import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { classToPlain } from 'class-transformer';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwCanNotDeleteErr, errorException } from 'src/common/utils/error';
import { Label } from 'src/model/label/label.schema';
import { Task } from 'src/model/task/task.schema';
import { paginator, toJsObject } from 'src/shared/helper';
import { AddLabelDTO } from './dto/add-label.dto';
import { UpdateLabelDTO } from './dto/update-label.dto';
import { LabelResponse } from './response/label-response';
import { LabelsResponse } from './response/labels-response';

@Injectable()
export class LabelService {
  constructor(
    @InjectModel('Label') private labelModel: PaginateModel<Label>,
    @InjectModel('Task') private taskModel: PaginateModel<Task>,
  ) {}

  async create(labelDTO: AddLabelDTO) {
    try {
      const label = await new this.labelModel(labelDTO).save();
      return classToPlain(new LabelResponse(toJsObject(label)));
    } catch (error) {
      errorException(error);
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
        const labels = await this.labelModel.paginate(query, options);
        return classToPlain(new LabelsResponse(toJsObject(labels)));
      } else {
        const labels = await this.labelModel
          .find(query)
          .sort({ created_at: SortQuery.Desc });
        return classToPlain(
          new LabelsResponse(toJsObject(paginator(labels, 0, labels.length))),
        );
      }
    } catch (error) {
      errorException(error);
    }
  }

  async getDetail(labelId: string) {
    try {
      const label = await this.checkIsLabelExist(labelId);
      label['tasks'] = await this.taskModel.find({ label: labelId });
      return classToPlain(new LabelResponse(toJsObject(label)));
    } catch (error) {
      errorException(error);
    }
  }

  async delete(labelId: string) {
    try {
      await this.checkIsLabelExist(labelId);
      const relatedTasks = await this.taskModel.find({ label: labelId });
      if (relatedTasks.length > 0) throwCanNotDeleteErr('Label', 'Tasks');
      await this.labelModel.findByIdAndDelete(labelId);
    } catch (error) {
      errorException(error);
    }
  }

  async update(labelId: string, labelDTO: UpdateLabelDTO) {
    try {
      const label = await this.labelModel.findByIdAndUpdate(labelId, labelDTO, {
        new: true,
      });
      if (!label) throw new NotFoundException('Label is not exist');
      return classToPlain(new LabelResponse(toJsObject(label)));
    } catch (error) {
      errorException(error);
    }
  }

  async findAllIds() {
    try {
      const labels = await this.labelModel.find().lean();
      return labels.map((label) => String(label._id));
    } catch (e) {
      errorException(e);
    }
  }

  async checkIsLabelExist(labelId: string) {
    try {
      const label = await this.labelModel.findById(labelId).lean();
      if (!label) throw new NotFoundException('Label is not exist');
      return label;
    } catch (e) {
      errorException(e);
    }
  }
}
