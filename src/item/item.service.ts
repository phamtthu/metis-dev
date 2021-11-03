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
import { Item } from 'src/model/item/item.schema';
import { TaskChecklist } from 'src/model/task-checklist/task-checklist.schema';
import { toJsObject } from 'src/shared/helper';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemResponse } from './response/item-response';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel('Item')
    private itemModel: PaginateModel<Item> & SoftDeleteModel<Item>,
    @InjectModel('Task_Checklist')
    private taskChecklistModel: Model<TaskChecklist>,
  ) {}

  async getIndex(taskChecklistId: string) {
    let index;
    const items = await this.itemModel.find({
      task_checklist: taskChecklistId,
    });
    if (items.length === 0) {
      index = 0;
      return index;
    }
    const largestTaskIndex = Math.max(...items.map((item) => item.index));
    index = largestTaskIndex + 1;
    return index;
  }

  async create(itemDto: AddItemDto, userId: string) {
    try {
      const index = await this.getIndex(itemDto.task_checklist);
      const item = await new this.itemModel({
        created_by: userId,
        index: index,
        ...itemDto,
      }).save();
      return classToPlain(new ItemResponse(toJsObject(item)));
    } catch (error) {
      errorException(error);
    }
  }

  async softDelete(itemId: string) {
    try {
      const { n } = await this.itemModel.deleteById(itemId);
      if (n === 1) {
        const item = await this.itemModel.findByIdAndUpdate(itemId, {
          index: null,
        });
        await this.itemModel.updateMany(
          { task_checklist: item.task_checklist, index: { $gt: item.index } },
          { $inc: { index: -1 } },
        );
      } else {
        throw new Error('Can not soft delete Item');
      }
    } catch (error) {
      errorException(error);
    }
  }

  async restore(itemId: string) {
    try {
      let item: any = await this.itemModel.findById(itemId);
      if (!item.deleted)
        throw new BadRequestException('Item is already restored');
      const { n } = await this.itemModel.restore({
        _id: itemId,
      });
      if (n === 1) {
        item = await this.itemModel.findByIdAndUpdate(
          itemId,
          { index: await this.getIndex(item.task_checklist) },
          { new: true },
        );
        return classToPlain(new ItemResponse(toJsObject(item)));
      } else {
        throw new Error('Can not restore Item');
      }
    } catch (error) {
      errorException(error);
    }
  }

  async update(itemId: string, itemDto: UpdateItemDto) {
    try {
      if (
        Object.keys(itemDto).length === 1 &&
        typeof itemDto.index === 'number'
      ) {
        const item = await this.findItemById(itemId);
        const isInValidIndex =
          itemDto.index < 0 ||
          itemDto.index > (await this.getIndex(item.task_checklist)) - 1;
        if (isInValidIndex)
          throw new BadRequestException('Index is out of range');
        const newItem = await this.itemModel.findByIdAndUpdate(
          itemId,
          itemDto,
          { new: true },
        );
        if (itemDto.index >= item.index) {
          await this.itemModel.updateMany(
            {
              task_checklist: item.task_checklist,
              index: {
                $gt: item.index,
                $lte: itemDto.index,
              },
              _id: { $ne: itemId },
            },
            { $inc: { index: -1 } },
          );
        } else {
          await this.itemModel.updateMany(
            {
              task_checklist: item.task_checklist,
              index: {
                $gte: itemDto.index,
                $lt: item.index,
              },
              _id: { $ne: itemId },
            },
            { $inc: { index: +1 } },
          );
        }
        return classToPlain(new ItemResponse(toJsObject(newItem)));
      } else if (itemDto.index == null) {
        const newItem = await this.itemModel.findByIdAndUpdate(
          itemId,
          itemDto,
          { new: true },
        );
        // Check is Checklist is completed
        await this.markOrUnMarkTaskChecklistCommplete(newItem.task_checklist);
        return classToPlain(new ItemResponse(toJsObject(newItem)));
      } else {
        throw new BadRequestException('Input is invalid');
      }
    } catch (error) {
      errorException(error);
    }
  }

  async markOrUnMarkTaskChecklistCommplete(taskChecklistId: string) {
    try {
      const items = await this.itemModel.find({
        task_checklist: taskChecklistId,
      });
      const completedItems = items.filter((item) => item.is_complete);
      if (completedItems.length === items.length) {
        await this.taskChecklistModel.findByIdAndUpdate(taskChecklistId, {
          is_complete: true,
        });
      } else {
        await this.taskChecklistModel.findByIdAndUpdate(taskChecklistId, {
          is_complete: false,
        });
      }
    } catch (error) {
      errorException(error);
    }
  }

  async findItemById(itemId: string) {
    try {
      const item = await this.itemModel
        .findById(itemId)
        .populate('task_checklist')
        .lean();
      if (!item) throw new NotFoundException('Item is not exist');
      return item;
    } catch (error) {
      errorException(error);
    }
  }
}
