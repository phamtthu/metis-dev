import { ConflictException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, PaginateModel } from 'mongoose'
import { SortQuery } from 'src/common/enum/filter.enum'
import { Resource } from 'src/model/resource.shema'
import { AddLaborDTO } from './dto/add-labor.dto'
import { UpdateLaborDTO } from './dto/update-labor'
import { Labor } from '../model/labor.shema'
import { throwSrvErr } from 'src/common/utils/error'
import { deleteImgPath, getNewImgLink } from 'src/common/utils/image-handler'
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto'
import { WorkCenter } from 'src/model/workcenter.schema'

@Injectable()
export class LaborService {

    constructor(
        @InjectModel('Labor') private laborModel: PaginateModel<Labor>,
        @InjectModel('Resource') private resourceModel: Model<Resource>,
        @InjectModel('WorkCenter') private workCenterModel: Model<WorkCenter>
    ) { }

    async create(laborDTO: AddLaborDTO, originURL: string) {
        try {
            const result = await this.laborModel.findOne({ labor_no: laborDTO.labor_no })
            if (result) throw new ConflictException('labor_no is already exist')
            laborDTO.image = await getNewImgLink(
                laborDTO.image,
                'labor',
                originURL)
            return await (new this.laborModel(laborDTO)).save()
        } catch (e) { throwSrvErr(e) }
    }

    async getList(paginateQuery: PaginationQueryDto, search: string) {
        try {
            const searchRegex = new RegExp(search, 'i')
            const query = {
                $or: [
                    { name: { $regex: searchRegex } },
                    { email: { $regex: searchRegex } },
                    { labor_no: { $regex: searchRegex } },
                    { note: { $regex: searchRegex } }
                ]
            }
            const populateOption = [
                { path: 'position', model: 'Position', select: 'name' },
                { path: 'skills.skill', model: 'Skill', select: 'name' },
                { path: 'work_centers', model: 'Skill', select: 'name' },
                { path: 'resources', model: 'Resource', select: 'equipment_name' },
                { path: 'tasks', model: 'Task', select: 'name' }
            ]
            if (paginateQuery.offset && paginateQuery.limit) {
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
        } catch (e) { throwSrvErr(e) }
    }

    async getDetail(laborId: string) {
        try {
            return await this.laborModel.findById(laborId)
                .populate(['position', 'work_centers', 'resources', 'tasks', 'skills.skill'])
        } catch (e) { throwSrvErr(e) }
    }

    async delete(laborId: string) {
        try {
            const deletedLabor = await this.laborModel.findByIdAndDelete(laborId)
            // Delete Image 
            if (deletedLabor.image)
                await deleteImgPath(deletedLabor.image)
            // Delete in Resource
            for await (const resourceId of deletedLabor.resources) {
                await this.resourceModel.findByIdAndUpdate(
                    resourceId,
                    { $pull: { 'labors': laborId } })
            }
            for await (const workcenterId of deletedLabor.work_centers) {
                await this.workCenterModel.findByIdAndUpdate(
                    workcenterId,
                    { $pull: { 'labors': laborId } })
            }
            return deletedLabor
        } catch (e) { throwSrvErr(e) }
    }

    async update(laborId: string, laborDTO: UpdateLaborDTO, originURL: string) {
        try {
            if (laborDTO.image)
                laborDTO.image = await getNewImgLink(
                    laborDTO.image,
                    'labor',
                    originURL)
            return await this.laborModel.findByIdAndUpdate(
                laborId,
                laborDTO,
                { new: true })
        } catch (e) { throwSrvErr(e) }
    }

    async findAllIds() {
        try {
            const labors = await this.laborModel.find().lean()
            return labors.map(labor => String(labor._id))
        } catch (e) { throwSrvErr(e) }
    }

    async findLaborByLaborNo(labor_no: string) {
        try {
            return await this.laborModel.findOne({ labor_no })
        } catch (e) { throwSrvErr(e) }
    }
}