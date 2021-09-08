import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, PaginateModel, Types } from 'mongoose'
import { SortQuery } from 'src/common/enum/filter.enum'
import { Labor } from 'src/model/labor.shema'
import { AddResourceDTO } from './dto/add-resource.dto'
import { UpdateResourceDTO } from './dto/update-resource.dto'
import { Resource } from '../model/resource.shema'
import { moveTmpToMain } from 'src/shared/helper'

@Injectable()
export class ResourceService {

    constructor(
        @InjectModel('Resource') private resourceModel: PaginateModel<Resource>,
        @InjectModel('Labor') private laborModel: Model<Labor>,
    ) { }

    async create(resourceDTO: AddResourceDTO) {
        resourceDTO.images = await moveTmpToMain(resourceDTO.images, 'resource')
        const resource = await (new this.resourceModel(resourceDTO)).save()
        for await (const laborId of resourceDTO.labors) {
            await this.laborModel.findByIdAndUpdate(laborId,
                { $push: { resources: resource._id } })
        }
        return resource
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
            return await this.resourceModel.paginate({}, options)
        } catch (e) { throw new Error(e.message) }
    }

    async getDetail(resourceId: string) {
        return await this.resourceModel.findById(resourceId)
    }

    async delete(resourceId: string) {
        const deletedResource = await this.resourceModel.findByIdAndDelete(resourceId).lean()
        if (deletedResource) {
            for await (const laborId of deletedResource.labors) {
                await this.laborModel.findByIdAndUpdate(laborId,
                    { $pull: { 'resources': deletedResource._id } })
            }
        }
        return deletedResource
    }

    async update(resourceId: string, resourceDTO: UpdateResourceDTO) {
        try {
            const oldResource = await this.resourceModel.findById(resourceId).lean()
            if (oldResource) {
                resourceDTO.images = await moveTmpToMain(resourceDTO.images, 'resource')
                const newResource = await this.resourceModel.findByIdAndUpdate(
                    resourceId, resourceDTO,
                    { new: true }
                ).lean()
                if (resourceDTO.labors?.length > 0) {
                    const removedLabors = oldResource.labors.filter((labordId) =>
                        !resourceDTO.labors.includes(String(labordId)))

                    const incomingLabors = resourceDTO.labors.filter((laborId) =>
                        !oldResource.labors.map((laborId) => String(laborId))
                            .includes(laborId))

                    for await (const laborId of removedLabors) {
                        await this.laborModel.findByIdAndUpdate(
                            laborId,
                            { $pull: { 'resources': newResource._id } })
                    }

                    for await (const laborId of incomingLabors) {
                        await this.laborModel.findByIdAndUpdate(laborId,
                            { $push: { 'resources': newResource._id } })
                    }
                }
                return newResource
            }
            else
                throw new NotFoundException('Resource is not exist')
        } catch (e) { throw new Error(e.message) }
    }

}