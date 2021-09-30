import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwSrvErr } from 'src/common/utils/error';
import { User } from 'src/model/user.shema';
import { Process } from 'src/model/process.schema';
import { Resource } from 'src/model/resource.shema';
import { Sequence } from 'src/model/sequence.schema';
import { isTwoArrayEqual } from 'src/shared/helper';
import { AddSequenceDTO } from './dto/add-sequence.dto';
import { UpdateSequenceDTO } from './dto/update-sequence.dto';

@Injectable()
export class SequenceService {
  constructor(
    @InjectModel('Process') private processModel: Model<Process>,
    @InjectModel('Sequence') private sequenceModel: PaginateModel<Sequence>,
    @InjectModel('Resource') private resourceModel: Model<Resource>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async create(sequenceDTO: AddSequenceDTO) {
    try {
      const sequence = await new this.sequenceModel(sequenceDTO).save();
      // Process
      await this.processModel.findByIdAndUpdate(sequenceDTO.process, {
        $push: { sequences: sequence._id },
      });
      // Resource
      await this.resourceModel.updateMany(
        { _id: { $in: sequenceDTO.resources } },
        { $push: { sequences: sequence._id } },
      );
      // User
      await this.userModel.updateMany(
        { _id: { $in: sequenceDTO.users } },
        { $push: { sequences: sequence._id } },
      );
      return sequence;
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
        return await this.sequenceModel.paginate(query, options);
      } else
        return await this.sequenceModel
          .find(query)
          .sort({ created_at: SortQuery.Desc });
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getDetail(sequenceId: string) {
    try {
      return await this.sequenceModel
        .findById(sequenceId)
        .populate(['process', 'resources', 'users', 'parent']);
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async delete(sequenceId: string) {
    try {
      const deletedSequence = await this.sequenceModel.findByIdAndDelete(
        sequenceId,
      );
      // Change parent of sub sequen to null
      await this.sequenceModel.updateMany(
        { parent: sequenceId, process: deletedSequence.process },
        { parent: null },
      );
      // Process
      await this.processModel.updateOne(
        { sequences: sequenceId },
        { $pull: { sequences: sequenceId } },
      );
      // Resource
      await this.resourceModel.updateMany(
        { sequences: sequenceId },
        { $pull: { sequences: sequenceId } },
      );
      // User
      await this.userModel.updateMany(
        { sequences: sequenceId },
        { $pull: { sequences: sequenceId } },
      );
      return deletedSequence;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async update(sequenceId: string, sequenceDTO: UpdateSequenceDTO) {
    try {
      const oldSequence = await this.sequenceModel.findById(sequenceId).lean();
      // Process
      if (String(oldSequence.process) !== sequenceDTO.process) {
        await this.processModel.findByIdAndUpdate(oldSequence.process, {
          $pull: { sequences: sequenceId },
        });
        await this.processModel.findByIdAndUpdate(sequenceDTO.process, {
          $push: { sequences: sequenceId },
        });
      }
      // Resource
      if (
        !isTwoArrayEqual(
          sequenceDTO.resources,
          oldSequence.resources.map((e) => String(e)),
        )
      ) {
        await this.resourceModel.updateMany(
          { _id: { $in: oldSequence.resources } },
          { $pull: { sequences: sequenceId } },
        );
        await this.resourceModel.updateMany(
          { _id: { $in: sequenceDTO.resources } },
          { $push: { sequences: sequenceId } },
        );
      }
      // User
      if (
        !isTwoArrayEqual(
          sequenceDTO.users,
          oldSequence.users.map((e) => String(e)),
        )
      ) {
        await this.userModel.updateMany(
          { _id: { $in: oldSequence.users } },
          { $pull: { sequences: sequenceId } },
        );
        await this.userModel.updateMany(
          { _id: { $in: sequenceDTO.users } },
          { $push: { sequences: sequenceId } },
        );
      }
      return await this.sequenceModel.findByIdAndUpdate(
        sequenceId,
        sequenceDTO,
        { new: true },
      );
    } catch (error) {
      throwSrvErr(error);
    }
  }
}
