import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwSrvErr } from 'src/common/utils/error';
import { User } from 'src/model/user.shema';
import { Position } from 'src/model/position.schema';
import { AddPositionDTO } from './dto/add-position.dto';
import { UpdatePositionDTO } from './dto/update-position.dto';

@Injectable()
export class PositionService {
  constructor(
    @InjectModel('Position') private positionModel: PaginateModel<Position>,
    @InjectModel('User') private userModel: PaginateModel<User>,
  ) {}

  async create(positionDTO: AddPositionDTO) {
    try {
      return await new this.positionModel(positionDTO).save();
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
        return await this.positionModel.paginate(query, options);
      } else
        return await this.positionModel
          .find(query)
          .sort({ created_at: SortQuery.Desc });
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getDetail(positionId: string) {
    try {
      return await this.positionModel.findById(positionId);
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async delete(positionId: string) {
    try {
      const deletedPosition = await this.positionModel.findByIdAndDelete(
        positionId,
      );
      // Delete Position ref in User
      await this.userModel.updateMany(
        { position: positionId },
        { position: null },
      );
      return deletedPosition;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async update(positionId: string, positionDTO: UpdatePositionDTO) {
    try {
      return await this.positionModel.findByIdAndUpdate(
        positionId,
        positionDTO,
        { new: true },
      );
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getUsersWithGivenPosition(
    positionId: string,
    paginateQuery: PaginationQueryDto,
  ) {
    try {
      const query = {
        position: positionId,
      };
      const populateOption = [
        { path: 'position', model: 'Position', select: 'name' },
        { path: 'skills.skill', model: 'Skill', select: 'name' },
        { path: 'work_centers', model: 'Skill', select: 'name' },
        { path: 'resources', model: 'Resource', select: 'equipment_name' },
        { path: 'tasks', model: 'Task', select: 'name' },
      ];
      if (
        paginateQuery.hasOwnProperty('offset') &&
        paginateQuery.hasOwnProperty('limit')
      ) {
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
        return await this.userModel.paginate(query, options);
      } else
        return await this.userModel
          .find(query)
          .populate(populateOption)
          .sort({ created_at: SortQuery.Desc });
    } catch (error) {
      throwSrvErr(error);
    }
  }
}
