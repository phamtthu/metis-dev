import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { classToPlain } from 'class-transformer';
import { Model, PaginateModel } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
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
    @InjectModel('Label') private labelModel: SoftDeleteModel<Label>,
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

  // Get List Label from given Board
  async getList(boardId: string) {
    try {
      const labels = await this.labelModel.find({ board: boardId });
      return classToPlain(
        new LabelsResponse(toJsObject(paginator(labels, 0, labels.length))),
      );
    } catch (error) {
      errorException(error);
    }
  }

  async delete(labelId: string) {
    try {
      const deletedLabel = await this.labelModel.findByIdAndDelete(labelId);
      if (!deletedLabel) {
        throw new NotFoundException('Label is not exist');
      }
      await this.taskModel.updateMany(
        { labels: labelId },
        {
          $pull: {
            labels: labelId,
          },
        },
      );
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

  async checkLabelExist(labelId: string) {
    try {
      const label = await this.labelModel.findById(labelId).lean();
      if (!label) throw new NotFoundException('Label is not exist');
      return label;
    } catch (e) {
      errorException(e);
    }
  }
}
