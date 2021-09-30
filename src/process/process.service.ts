import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwSrvErr } from 'src/common/utils/error';
import { Process } from 'src/model/process.schema';
import { Sequence } from 'src/model/sequence.schema';
import { getNestedList } from 'src/shared/helper';
import { AddProcessDTO } from './dto/add-process.dto';
import { UpdateProcessDTO } from './dto/update-process.dto';

@Injectable()
export class ProcessService {
  constructor(
    @InjectModel('Process') private processModel: PaginateModel<Process>,
    @InjectModel('Sequence') private sequenceModel: Model<Sequence>,
  ) {}

  async create(processDTO: AddProcessDTO) {
    try {
      return await new this.processModel(processDTO).save();
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
          { process_no: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { attributes: { $regex: searchRegex } },
        ],
      };
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
        return await this.processModel.paginate(query, options);
      } else
        return await this.processModel
          .find(query)
          .sort({ created_at: SortQuery.Desc })
          .select('username');
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getDetail(processId: string) {
    try {
      // Flat Sequence
      // const process = await this.processModel.findById(processId).populate('sequences')
      // Nested Sequence
      const sequencePopulateOption = [
        { path: 'users', model: 'User', select: 'name' },
        { path: 'resources', model: 'Resource', select: 'name' },
        { path: 'process', model: 'Process', select: 'name' },
      ];
      const process = await this.processModel.findById(processId).lean();
      const sequences = await this.sequenceModel
        .find({ process: processId })
        .populate(sequencePopulateOption)
        .lean();
      process['sequences'] = getNestedList(null, sequences);
      return process;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async delete(processId: string) {
    try {
      const deletedProcess = await this.processModel.findByIdAndDelete(
        processId,
      );
      // Sequence
      await this.sequenceModel.updateMany(
        { process: processId },
        { process: null },
      );
      return deletedProcess;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async update(processId: string, processDTO: UpdateProcessDTO) {
    try {
      return await this.processModel.findByIdAndUpdate(processId, processDTO, {
        new: true,
      });
    } catch (error) {
      throwSrvErr(error);
    }
  }
}
