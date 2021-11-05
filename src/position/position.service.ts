import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwCanNotDeleteErr, errorException } from 'src/common/utils/error';
import { Position } from 'src/model/position/position.schema';
import { AddPositionDto } from './dto/add-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionResponse } from './response/position-response';
import { classToPlain } from 'class-transformer';
import { paginator, toJsObject } from 'src/shared/helper';
import { PositionsResponse } from './response/positions-response';
import { User } from 'src/model/user/user.shema';

@Injectable()
export class PositionService {
  constructor(
    @InjectModel('Position') private positionModel: PaginateModel<Position>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async create(positionDto: AddPositionDto) {
    try {
      const position = await new this.positionModel(positionDto).save();
      return classToPlain(new PositionResponse(toJsObject(position)));
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
        const positions = await this.positionModel.paginate(query, options);
        return classToPlain(new PositionsResponse(toJsObject(positions)));
      } else {
        const positions = await this.positionModel
          .find(query)
          .sort({ created_at: SortQuery.Desc });
        return classToPlain(
          new PositionsResponse(
            toJsObject(paginator(positions, 0, positions.length)),
          ),
        );
      }
    } catch (error) {
      errorException(error);
    }
  }

  async getDetail(positionId: string) {
    try {
      const position = await this.checkIsPositionExist(positionId);
      return classToPlain(new PositionResponse(toJsObject(position)));
    } catch (error) {
      errorException(error);
    }
  }

  async delete(positionId: string) {
    try {
      await this.checkIsPositionExist(positionId);
      const relatedUsers = await this.userModel.find({ position: positionId });
      if (relatedUsers.length > 0) throwCanNotDeleteErr('Position', 'User');
      await this.positionModel.findByIdAndDelete(positionId);
    } catch (error) {
      errorException(error);
    }
  }

  async update(positionId: string, positionDto: UpdatePositionDto) {
    try {
      const newPosition = await this.positionModel.findByIdAndUpdate(
        positionId,
        positionDto,
        {
          new: true,
        },
      );
      if (!newPosition) throw new NotFoundException('Position is not exist');
      return classToPlain(new PositionResponse(toJsObject(newPosition)));
    } catch (error) {
      errorException(error);
    }
  }

  async checkIsPositionExist(positionId: string) {
    try {
      const position = await this.positionModel.findById(positionId).lean();
      if (!position) throw new NotFoundException('Position is not exist');
      return position;
    } catch (error) {
      errorException(error);
    }
  }
}
