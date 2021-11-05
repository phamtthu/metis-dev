import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwCanNotDeleteErr, errorException } from 'src/common/utils/error';
import { Skill } from 'src/model/skill/skill.schema';
import { AddSkillDTO } from './dto/add-skill.dto';
import { UpdateSkillDTO } from './dto/update-skill.dto';
import { Task } from 'src/model/task/task.schema';
import { SkillResponse } from './response/skill-response';
import { classToPlain } from 'class-transformer';
import { paginator, toJsObject } from 'src/shared/helper';
import { SkillsResponse } from './response/skills-response';
import { User } from 'src/model/user/user.shema';

@Injectable()
export class SkillService {
  constructor(
    @InjectModel('Skill') private skillModel: PaginateModel<Skill>,
    @InjectModel('Task') private taskModel: Model<Task>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async create(skillDTO: AddSkillDTO) {
    try {
      const skill = await new this.skillModel(skillDTO).save();
      return classToPlain(new SkillResponse(toJsObject(skill)));
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
        const skills = await this.skillModel.paginate(query, options);
        return classToPlain(new SkillsResponse(toJsObject(skills)));
      } else {
        const skills = await this.skillModel
          .find(query)
          .sort({ created_at: SortQuery.Desc });
        return classToPlain(
          new SkillsResponse(toJsObject(paginator(skills, 0, skills.length))),
        );
      }
    } catch (error) {
      errorException(error);
    }
  }

  async getDetail(skillId: string) {
    try {
      const skill = await this.checkIsSkillExist(skillId);
      skill['tasks'] = await this.taskModel.find({ skill: skillId });
      return classToPlain(new SkillResponse(toJsObject(skill)));
    } catch (error) {
      errorException(error);
    }
  }

  async delete(skillId: string) {
    try {
      await this.checkIsSkillExist(skillId);
      const relatedTasks = await this.taskModel.find({ skill: skillId });
      if (relatedTasks.length > 0) throwCanNotDeleteErr('Skill', 'Task');
      const relatedUsers = await this.userModel.find({
        'skills.skill': skillId,
      });
      if (relatedTasks.length > 0) throwCanNotDeleteErr('Skill', 'User');
      await this.skillModel.findByIdAndDelete(skillId);
    } catch (error) {
      errorException(error);
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
      return classToPlain(new SkillResponse(toJsObject(newSkill)));
    } catch (error) {
      errorException(error);
    }
  }

  async checkIsSkillExist(skillId: string) {
    try {
      const skill = await this.skillModel.findById(skillId).lean();
      if (!skill) throw new NotFoundException('Skill is not exist');
      return skill;
    } catch (error) {
      errorException(error);
    }
  }
}
