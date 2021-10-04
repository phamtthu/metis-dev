import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import process from 'process';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwCanNotDeleteErr, throwSrvErr } from 'src/common/utils/error';
import { Process } from 'src/model/process/process.schema';
import { Sequence } from 'src/model/sequence/sequence.schema';
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

  async getList(queryDto: PaginationQueryDto) {
    try {
      const searchRegex = new RegExp(queryDto.search, 'i');
      const query = {
        $or: [
          { name: { $regex: searchRegex } },
          { process_no: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { attributes: { $regex: searchRegex } },
        ],
      };
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
        return await this.processModel.paginate(query, options);
      } else
        return await this.processModel
          .find(query)
          .sort({ created_at: SortQuery.Desc });
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getDetail(processId: string) {
    try {
      // Flat Sequence
      // const process = await this.processModel.findById(processId).populate('sequences')
      // Nested Sequence
      const process = await this.checkIsProcessIsExiss(processId);
      const sequences = await this.sequenceModel
        .find({ process: processId })
        .lean();
      process['sequences'] = getNestedList(null, sequences);
      return process;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async delete(processId: string) {
    try {
      await this.checkIsProcessIsExiss(processId);
      const relatedSequences = await this.sequenceModel.find({
        process: processId,
      });
      if (relatedSequences.length > 0)
        throwCanNotDeleteErr('Process', 'Sequence');
      await this.processModel.findByIdAndDelete(processId);
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async update(processId: string, processDTO: UpdateProcessDTO) {
    try {
      const process = await this.processModel.findByIdAndUpdate(
        processId,
        processDTO,
        { new: true },
      );
      if (!process) throw new NotFoundException('Process is not exist');
      return process;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async checkIsProcessIsExiss(processId: string) {
    try {
      const process = await this.processModel.findById(processId).lean();
      if (!process) throw new NotFoundException('Process is not exist');
      return process;
    } catch (error) {
      throwSrvErr(error);
    }
  }
}
