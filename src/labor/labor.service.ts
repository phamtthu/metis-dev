import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, PaginateModel } from 'mongoose'
import { SortQuery } from 'src/common/enum/filter.enum'
import { Resource } from 'src/model/resource.shema'
import { AddLaborDTO } from './dto/add-labor.dto'
import { UpdateLaborDTO } from './dto/update-labor'
import { Labor } from '../model/labor.shema'
import { moveSingleTmpToMain } from 'src/shared/helper'
import { throwSrvErr } from 'src/common/utils/error'
import { deleteImgPath, getNewImgLink } from 'src/common/utils/image-handler'
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto'

@Injectable()
export class LaborService {

    constructor(
        @InjectModel('Labor') private laborModel: PaginateModel<Labor>,
        @InjectModel('Resource') private resourceModel: Model<Resource>,
    ) { }

    async create(laborDTO: AddLaborDTO, originURL: string) {
        try {
            laborDTO.image = await getNewImgLink(
                laborDTO.image,
                'labor',
                originURL)
            return await (new this.laborModel(laborDTO)).save()
        } catch (e) { throwSrvErr(e) }
    }

    async getList(paginateQuery: PaginationQueryDto) {
        try {
            if (paginateQuery.hasOwnProperty('offset')
                && paginateQuery.hasOwnProperty('limit')) {
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
                return await this.laborModel.paginate({}, options)
            } else
                return await this.laborModel.find()
        } catch (e) { throwSrvErr(e) }
    }

    async getDetail(laborId: string) {
        try {
            return await this.laborModel.findById(laborId)
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
                    { $pull: { 'labors': deletedLabor._id } })
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