import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, PaginateModel, Types } from 'mongoose'
import { SortQuery } from 'src/common/enum/filter.enum'
import { Labor } from 'src/model/labor.shema'
import { AddResourceDTO } from './dto/add-resource.dto'
import { UpdateResourceDTO } from './dto/update-resource.dto'
import { Resource } from '../model/resource.shema'
import { throwSrvErr } from 'src/common/utils/error'
import { deleteImgPath, getNewImgLink } from 'src/common/utils/image-handler'
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto'
import { WorkCenter } from 'src/model/workcenter.schema'
import { IsTwoArrayEqual } from 'src/shared/helper'

@Injectable()
export class ResourceService {

    constructor(
        @InjectModel('Resource') private resourceModel: PaginateModel<Resource>,
        @InjectModel('Labor') private laborModel: Model<Labor>,
        @InjectModel('WorkCenter') private workCenterModel: Model<WorkCenter>
    ) { }

    async create(resourceDTO: AddResourceDTO, originURL: string) {
        try {
            const result = await this.resourceModel.findOne({ resource_no: resourceDTO.resource_no })
            if (result) throw new ConflictException('resource_no is already exist')
            resourceDTO.images = await Promise.all(resourceDTO.images.map(async (img) =>
                await getNewImgLink(img, 'resource', originURL)))
            const resource = await (new this.resourceModel(resourceDTO)).save()
            for await (const laborId of resourceDTO.labors) {
                await this.laborModel.findByIdAndUpdate(laborId,
                    { $push: { resources: resource._id } })
            }
            await this.workCenterModel.findByIdAndUpdate(
                resourceDTO.work_center,
                { $push: { resources: resource._id } }
            )
            return resource
        } catch (e) { throwSrvErr(e) }
    }

    async getList(paginateQuery: PaginationQueryDto, search: string) {
        try {
            const searchRegex = new RegExp(search, 'i')
            const query = {
                $or: [
                    { equipment_name: { $regex: searchRegex } },
                    { resource_no: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } }
                ]
            }
            const populateOption = [
                { path: 'category', model: 'ResourceCategory', select: 'name' },
                { path: 'work_center', model: 'WorkCenter', select: 'name' },
                { path: 'labors', model: 'Labor', select: 'name' }
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
                return await this.resourceModel.paginate(query, options)
            } else
                return await this.resourceModel.find(query)
                    .populate(populateOption)
                    .sort({ 'created_at': SortQuery.Desc })
        } catch (e) { throwSrvErr(e) }
    }

    async getDetail(resourceId: string) {
        try {
            return await this.resourceModel.findById(resourceId)
                .populate(['category', 'work_center', 'labors'])
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
            // Cascade Delete
            for await (const laborId of deletedResource.labors) {
                await this.laborModel.findByIdAndUpdate(laborId,
                    { $pull: { 'resources': resourceId } })
            }
            await this.workCenterModel.findByIdAndUpdate(
                deletedResource.work_center,
                { $pull: { 'resources': resourceId } }
            )
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

            const newResource = await this.resourceModel.findByIdAndUpdate(
                resourceId, resourceDTO,
                { new: true }
            ).lean()
            if (!IsTwoArrayEqual(resourceDTO.labors, oldResource.labors)) {
                const removedLabors = oldResource.labors.filter((labordId) =>
                    !resourceDTO.labors.includes(String(labordId)))

                const incomingLabors = resourceDTO.labors.filter((laborId) =>
                    !oldResource.labors.map((laborId) => String(laborId))
                        .includes(laborId))

                for await (const laborId of removedLabors) {
                    await this.laborModel.findByIdAndUpdate(
                        laborId,
                        { $pull: { 'resources': resourceId } })
                }

                for await (const laborId of incomingLabors) {
                    await this.laborModel.findByIdAndUpdate(laborId,
                        { $push: { 'resources': resourceId } })
                }
            }
            if (resourceDTO.work_center !== String(oldResource.work_center)) {
                await this.workCenterModel.findByIdAndUpdate(
                    oldResource.work_center,
                    { $pull: { 'resources': resourceId } }
                )
                await this.workCenterModel.findByIdAndUpdate(
                    resourceDTO.work_center,
                    { $push: { 'resources': resourceId } }
                )
            }
            return newResource

        } catch (e) { throwSrvErr(e) }
    }

    async findResourceByResourceNo(resource_no: string) {
        try {
            return await this.resourceModel.findOne({ resource_no })
        } catch (e) { throwSrvErr(e) }
    }

}