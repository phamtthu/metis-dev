import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PaginateModel } from "mongoose";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";
import { SortQuery } from "src/common/enum/filter.enum";
import { throwSrvErr } from "src/common/utils/error";
import { Labor } from "src/model/labor.shema";
import { Skill } from "src/model/skill.schema";
import { AddSkillDTO } from "./dto/add-skill.dto";
import { UpdateSkillDTO } from "./dto/update-skill.dto";

@Injectable()
export class SkillService {

    constructor(
        @InjectModel('Skill') private skillModel: PaginateModel<Skill>,
        @InjectModel('Labor') private laborModel: PaginateModel<Labor>
    ) { }

    async create(skillDTO: AddSkillDTO) {
        try {
            return await (new this.skillModel(skillDTO)).save()
        } catch (error) { throwSrvErr(error) }
    }

    async getList(paginateQuery: PaginationQueryDto, search: string) {
        try {
            const searchRegex = new RegExp(search, 'i')
            const query = { name: { $regex: searchRegex } }

            if (paginateQuery.offset && paginateQuery.limit) {
                const options = {
                    offset: paginateQuery.offset,
                    limit: paginateQuery.limit,
                    sort: { created_at: SortQuery.Desc },
                    customLabels: {
                        page: 'page',
                        limit: 'per_page',
                        totalDocs: 'total',
                        totalPages: 'total_pages',
                        docs: 'data'
                    }
                }
                return await this.skillModel.paginate(query, options)
            } else
                return await this.skillModel.find(query)
                    .sort({ 'created_at': SortQuery.Desc })
        } catch (error) { throwSrvErr(error) }
    }

    async getDetail(skillId: string) {
        try {
            return await this.skillModel.findById(skillId)
        } catch (error) { throwSrvErr(error) }
    }

    async delete(skillId: string) {
        try {
            const deletedSkill = await this.skillModel.findByIdAndDelete(skillId)
            // Delete Skill ref In Labor
            await this.laborModel.updateMany(
                { "skills.skill": skillId },
                { "$pull": { "skills": { "skill": skillId } } }
            )
            return deletedSkill
        } catch (error) { throwSrvErr(error) }
    }

    async update(skillId: string, skillDTO: UpdateSkillDTO) {
        try {
            return await this.skillModel.findByIdAndUpdate(
                skillId,
                skillDTO,
                { new: true })
        } catch (error) { throwSrvErr(error) }
    }

    async getLaborsWithGivenSkill(skillId: string, paginateQuery: PaginationQueryDto) {
        try {
            const query = {
                'skills.skill': skillId
            }
            const populateOption = [
                { path: 'position', model: 'Position', select: 'name' },
                { path: 'skills.skill', model: 'Skill', select: 'name' },
                { path: 'work_centers', model: 'Skill', select: 'name' },
                { path: 'resources', model: 'Resource', select: 'equipment_name' },
                { path: 'tasks', model: 'Task', select: 'name' }
            ]
            if (paginateQuery.hasOwnProperty('offset')
                && paginateQuery.hasOwnProperty('limit')) {
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
                        docs: 'data'
                    }
                }
                return await this.laborModel.paginate(query, options)
            } else
                return await this.laborModel.find(query)
                    .populate(populateOption)
                    .sort({ 'created_at': SortQuery.Desc })

        } catch (error) { throwSrvErr(error) }
    }

}