import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwCanNotDeleteErr, throwSrvErr } from 'src/common/utils/error';
import { Skill } from 'src/model/skill/skill.schema';
import { AddSkillDTO } from './dto/add-skill.dto';
import { UpdateSkillDTO } from './dto/update-skill.dto';
import { Task } from 'src/model/task/task.schema';

@Injectable()
export class SkillService {
  constructor(
    @InjectModel('Skill') private skillModel: PaginateModel<Skill>,
    @InjectModel('Task') private taskModel: Model<Task>,
  ) {}

  async create(skillDTO: AddSkillDTO) {
    try {
      return await new this.skillModel(skillDTO).save();
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
        return await this.skillModel.paginate(query, options);
      } else
        return await this.skillModel
          .find(query)
          .sort({ created_at: SortQuery.Desc });
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getDetail(skillId: string) {
    try {
      const skill = await this.checkIsSkillExist(skillId);
      skill['tasks'] = await this.taskModel.find({ skill: skillId });
      return skill;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async delete(skillId: string) {
    try {
      await this.checkIsSkillExist(skillId);
      const relatedTasks = await this.taskModel.find({ skill: skillId });
      if (relatedTasks.length > 0) throwCanNotDeleteErr('Skill', 'Task');
      await this.skillModel.findByIdAndDelete(skillId);
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async update(skillId: string, skillDTO: UpdateSkillDTO) {
    try {
      const newSkill = await this.skillModel.findByIdAndUpdate(
        skillId,
        skillDTO,
        {
          new: true,
        },
      );
      if (!newSkill) throw new NotFoundException('Skill is not exist');
      return newSkill;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async checkIsSkillExist(skillId: string) {
    try {
      const skill = await this.skillModel.findById(skillId).lean();
      if (!skill) throw new NotFoundException('Skill is not exist');
      return skill;
    } catch (error) {
      throwSrvErr(error);
    }
  }
}
