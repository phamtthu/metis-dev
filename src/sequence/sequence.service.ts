import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwCanNotDeleteErr, throwSrvErr } from 'src/common/utils/error';
import { User } from 'src/model/user/user.shema';
import { Process } from 'src/model/process/process.schema';
import { Resource } from 'src/model/resource/resource.shema';
import { Sequence } from 'src/model/sequence/sequence.schema';
import { AddSequenceDTO } from './dto/add-sequence.dto';
import { UpdateSequenceDTO } from './dto/update-sequence.dto';
import { SequenceResource } from 'src/model/sequence-resource/sequence-resource.schema';
import { SequenceUser } from 'src/model/sequence-user/sequence-user.schema';
import { getNestedList } from 'src/shared/helper';

@Injectable()
export class SequenceService {
  constructor(
    @InjectModel('Process') private processModel: Model<Process>,
    @InjectModel('Sequence') private sequenceModel: PaginateModel<Sequence>,
    @InjectModel('Resource') private resourceModel: Model<Resource>,
    @InjectModel('Sequence_Resource')
    private sequenceResourceModel: Model<SequenceResource>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Sequence_User')
    private sequenceUserModel: Model<SequenceUser>,
  ) {}

  async create(sequenceDTO: AddSequenceDTO) {
    try {
      return await new this.sequenceModel(sequenceDTO).save();
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
      const sequence = await this.checkIsSequenceExist(sequenceId);
      const sequenceResources = await this.sequenceResourceModel
        .find({ sequence: sequenceId })
        .populate('resource');
      const subSequences = await this.sequenceModel
        .find({ parent: sequenceId })
        .lean();
      sequence['sub_sequences'] = getNestedList(sequenceId, subSequences);
      sequence['resources'] = sequenceResources.map((e) => e.resource);
      const sequenceUsers = await this.sequenceUserModel
        .find({ sequence: sequenceId })
        .populate('user');
      sequence['users'] = sequenceUsers.map((e) => e.user);
      return sequence;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async delete(sequenceId: string) {
    try {
      const deletedSequence = await this.sequenceModel.findByIdAndDelete(
        sequenceId,
      );
      if (!deletedSequence)
        throw new NotFoundException('Sequence is not exist');
      await this.sequenceResourceModel.deleteMany({
        sequence: sequenceId,
      });
      await this.sequenceUserModel.deleteMany({ sequence: sequenceId });
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async update(sequenceId: string, sequenceDTO: UpdateSequenceDTO) {
    try {
      await this.checkIsSequenceExist(sequenceId);
      // Add Resource to Sequence
      if (Array.isArray(sequenceDTO.resources)) {
        await this.sequenceResourceModel.deleteMany({
          sequence: sequenceId,
        });
        const sequenceResources = sequenceDTO.resources.map((resourceId) => ({
          sequence: sequenceId,
          resource: resourceId,
        }));
        return await this.sequenceResourceModel.insertMany(sequenceResources);
        // Add User to Sequence
      } else if (Array.isArray(sequenceDTO.users)) {
        await this.sequenceUserModel.deleteMany({
          sequence: sequenceId,
        });
        const sequenceUsers = sequenceDTO.users.map((userId) => ({
          sequence: sequenceId,
          user: userId,
        }));
        return await this.sequenceUserModel.insertMany(sequenceUsers);
      } else {
        return await this.sequenceModel.findByIdAndUpdate(
          sequenceId,
          sequenceDTO,
          { new: true },
        );
      }
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async checkIsSequenceExist(sequenceId: string) {
    try {
      const sequence = await this.sequenceModel
        .findById(sequenceId)
        .populate('process')
        .lean();
      if (!sequence) throw new NotFoundException('Sequence is not exist');
      return sequence;
    } catch (error) {
      throwSrvErr(error);
    }
  }
}
