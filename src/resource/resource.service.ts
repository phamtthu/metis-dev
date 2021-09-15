import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, PaginateModel, Types } from 'mongoose'
import { SortQuery } from 'src/common/enum/filter.enum'
import { Labor } from 'src/model/labor.shema'
import { AddResourceDTO } from './dto/add-resource.dto'
import { UpdateResourceDTO } from './dto/update-resource.dto'
import { Resource } from '../model/resource.shema'
import { moveTmpToMain } from 'src/shared/helper'
import { throwSrvErr } from 'src/common/utils/error'
import { deleteImgPath, getNewImgLink } from 'src/common/utils/image-handler'
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto'

@Injectable()
export class ResourceService {

    constructor(
        @InjectModel('Resource') private resourceModel: PaginateModel<Resource>,
        @InjectModel('Labor') private laborModel: Model<Labor>
    ) { }

    async create(resourceDTO: AddResourceDTO, originURL: string) {
        try {
            resourceDTO.images = await Promise.all(resourceDTO.images.map(async (img) =>
                await getNewImgLink(img, 'resource', originURL)))
            const resource = await (new this.resourceModel(resourceDTO)).save()
            for await (const laborId of resourceDTO.labors) {
                await this.laborModel.findByIdAndUpdate(laborId,
                    { $push: { resources: resource._id } })
            }
            return resource
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
                return await this.resourceModel.paginate({}, options)
            } else
                return await this.resourceModel.find()
        } catch (e) { throwSrvErr(e) }
    }

    async getDetail(resourceId: string) {
        try {
            return await this.resourceModel.findById(resourceId)
                .populate('labors')
        } catch (e) { throwSrvErr(e) }
    }

    async delete(resourceId: string) {
        try {
            const deletedResource = await this.resourceModel.findByIdAndDelete(resourceId)
                .lean()
            // Delete Image
            deletedResource.images.forEach(async (img) => {
                await deleteImgPath(img)
            })
            if (deletedResource) {
                for await (const laborId of deletedResource.labors) {
                    await this.laborModel.findByIdAndUpdate(laborId,
                        { $pull: { 'resources': deletedResource._id } })
                }
            }
            return deletedResource
        } catch (e) { throwSrvErr(e) }
    }

    async update(resourceId: string, resourceDTO: UpdateResourceDTO, originURL: string) {
        try {
            const oldResource = await this.resourceModel.findById(resourceId).lean()

            oldResource.images.forEach(async (img) => {
                await deleteImgPath(img)
            })
            resourceDTO.images = await Promise.all(resourceDTO.images.map(async (img) =>
                await getNewImgLink(img, 'resource', originURL)))

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
        } catch (e) { throwSrvErr(e) }
    }

    async findResourceByResourceNo(resource_no: string) {
        try {
            return await this.resourceModel.findOne({ resource_no })
        } catch (e) { throwSrvErr(e) }
    }

}