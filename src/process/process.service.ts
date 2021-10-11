import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { classToPlain } from 'class-transformer';
import { Model, PaginateModel } from 'mongoose';
import process from 'process';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwCanNotDeleteErr, errorException } from 'src/common/utils/error';
import { Process } from 'src/model/process/process.schema';
import { Sequence } from 'src/model/sequence/sequence.schema';
import {
  generateRandomCode,
  getNestedList,
  paginator,
  toJsObject,
} from 'src/shared/helper';
import { AddProcessDTO } from './dto/add-process.dto';
import { UpdateProcessDTO } from './dto/update-process.dto';
import { ProcessDetailResponse } from './response/process-detail-response';
import { ProcessResponse } from './response/process-response';
import { ProcessesResponse } from './response/processes-response';

@Injectable()
export class ProcessService {
  constructor(
    @InjectModel('Process') private processModel: PaginateModel<Process>,
    @InjectModel('Sequence') private sequenceModel: Model<Sequence>,
  ) {}

  async create(processDTO: AddProcessDTO) {
    try {
      const codes = (await this.processModel.find()).map((e) => e.process_no);
      const process = await new this.processModel({
        process_no: generateRandomCode(codes),
        ...processDTO,
      }).save();
      return classToPlain(new ProcessResponse(toJsObject(process)));
    } catch (error) {
      errorException(error);
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
        const processes = await this.processModel.paginate(query, options);
        return classToPlain(new ProcessesResponse(toJsObject(processes)));
      } else {
        const processes = await this.processModel
          .find(query)
          .sort({ created_at: SortQuery.Desc });
        return classToPlain(
          new ProcessesResponse(
            toJsObject(paginator(processes, 0, processes.length)),
          ),
        );
      }
    } catch (error) {
      errorException(error);
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
      return classToPlain(new ProcessDetailResponse(toJsObject(process)));
    } catch (error) {
      errorException(error);
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
      errorException(error);
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
      return classToPlain(new ProcessResponse(toJsObject(process)));
    } catch (error) {
      errorException(error);
    }
  }

  async checkIsProcessIsExiss(processId: string) {
    try {
      const process = await this.processModel.findById(processId).lean();
      if (!process) throw new NotFoundException('Process is not exist');
      return process;
    } catch (error) {
      errorException(error);
    }
  }
}
