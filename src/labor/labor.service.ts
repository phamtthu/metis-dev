import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, PaginateModel } from 'mongoose'
import { SortQuery } from 'src/common/enum/filter.enum'
import { Resource } from 'src/model/resource.shema'
import { AddLaborDTO } from './dto/add-labor.dto'
import { UpdateLaborDTO } from './dto/update-labor'
import { Labor } from '../model/labor.shema'
import { moveSingleTmpToMain } from 'src/shared/helper'

@Injectable()
export class LaborService {

    constructor(
        @InjectModel('Labor') private laborModel: PaginateModel<Labor>,
        @InjectModel('Resource') private resourceModel: Model<Resource>,
    ) { }

    async create(laborDTO: AddLaborDTO) {
        try {
            laborDTO.avatar = await moveSingleTmpToMain(laborDTO.avatar, 'labor')
            return await (new this.laborModel(laborDTO)).save()
        } catch (e) { throw new Error(e.message) }
    }

    async getList({ offset = 0, limit = 10 }) {
        try {
            const options = {
                offset: offset,
                limit: limit,
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
        } catch (e) { throw new Error(e.message) }
    }

    async getDetail(laborId: string) {
        try {
            return await this.laborModel.findById(laborId)
        } catch (e) { throw new Error(e.message) }
    }

    async delete(laborId: string) {
        try {
            const deletedLabor = await this.laborModel.findByIdAndDelete(laborId)
            // Delete in Resource
            if (deletedLabor)
                for await (const resourceId of deletedLabor.resources) {
                    await this.resourceModel.findByIdAndUpdate(
                        resourceId,
                        { $pull: { 'labors': deletedLabor._id } })
                }
            return deletedLabor
        } catch (e) { throw new Error(e.message) }
    }

    async update(laborId: string, laborDTO: UpdateLaborDTO) {
        try {
            return await this.laborModel.findByIdAndUpdate(
                laborId,
                laborDTO,
                { new: true })
        } catch (e) { throw new Error(e.message) }
    }

    async findAllIds() {
        try {
            const labors = await this.laborModel.find().lean()
            return labors.map(labor => String(labor._id))
        } catch (e) { throw new Error(e.message) }
    }

}