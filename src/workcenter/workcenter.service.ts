import { ConflictException, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, PaginateModel } from "mongoose"
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto"
import { SortQuery } from "src/common/enum/filter.enum"
import { throwSrvErr } from "src/common/utils/error"
import { Labor } from "src/model/labor.shema"
import { Resource } from "src/model/resource.shema"
import { WorkCenter } from "src/model/workcenter.schema"
import { isTwoArrayEqual } from "src/shared/helper"
import { AddWorkCenterDTO } from "./dto/add-workcenter.dto"
import { UpdateWorkCenterDTO } from "./dto/update-workcenter.dto"

@Injectable()
export class WorkCenterService {

    constructor(
        @InjectModel('WorkCenter') private workCenterModel: PaginateModel<WorkCenter>,
        @InjectModel('Labor') private laborModel: PaginateModel<Labor>,
        @InjectModel('Resource') private resourceModel: PaginateModel<Resource>
    ) { }

    async create(workCenterDTO: AddWorkCenterDTO) {
        try {
            const result = await this.workCenterModel.findOne({ work_center_no: workCenterDTO.work_center_no })
            if (result)
                throw new ConflictException('work_center_no is already exist')
            const workcenter = await (new this.workCenterModel(workCenterDTO)).save()
            await this.laborModel.updateMany(
                { _id: { "$in": workCenterDTO.labors } },
                { $push: { work_centers: workcenter._id } })

            return workcenter
        } catch (error) { throwSrvErr(error) }
    }

    async getList(paginateQuery: PaginationQueryDto, search: string) {
        try {
            const searchRegex = new RegExp(search, 'i')
            const query = {
                $or: [
                    { name: { $regex: searchRegex } },
                    { work_center_no: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } }
                ]
            }
            const populateOption = [
                { path: 'labors', model: 'Labor', select: 'name' },
                { path: 'resources', model: 'Resource', select: 'equipment_name' }
            ]
            if (paginateQuery.offset >= 0 && paginateQuery.limit >= 0) {
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
                return await this.workCenterModel.paginate(query, options)
            } else
                return await this.workCenterModel.find(query)
                    .populate(populateOption)
                    .sort({ 'created_at': SortQuery.Desc })
        } catch (error) { throwSrvErr(error) }
    }

    async getDetail(workCenterId: string) {
        try {
            return await this.workCenterModel.findById(workCenterId)
                .populate('labors')
                .populate('resources')
        } catch (error) { throwSrvErr(error) }
    }

    async delete(workCenterId: string) {
        try {
            const deletedWC = await this.workCenterModel.findByIdAndDelete(workCenterId)
            await this.laborModel.updateMany(
                { work_centers: workCenterId },
                { $pull: { 'work_centers': workCenterId } })
            await this.resourceModel.updateMany(
                { work_center: workCenterId },
                { work_center: null })
            return deletedWC

        } catch (error) { throwSrvErr(error) }
    }

    async update(workCenterId: string, workCenterDTO: UpdateWorkCenterDTO) {
        try {
            const oldWCenter = await this.workCenterModel.findById(workCenterId).lean()
            const newWCenter = await this.workCenterModel.findByIdAndUpdate(
                workCenterId,
                workCenterDTO,
                { new: true })

            if (!isTwoArrayEqual(workCenterDTO.labors, oldWCenter.labors.map((e) => String(e)))) {
                const removedLabors = oldWCenter.labors.filter((labordId) =>
                    !workCenterDTO.labors.includes(String(labordId)))

                const incomingLabors = workCenterDTO.labors.filter((laborId) =>
                    !oldWCenter.labors.map((laborId) => String(laborId))
                        .includes(laborId))

                for await (const laborId of removedLabors) {
                    await this.laborModel.findByIdAndUpdate(
                        laborId,
                        { $pull: { 'work_centers': workCenterId } })
                }

                for await (const laborId of incomingLabors) {
                    await this.laborModel.findByIdAndUpdate(laborId,
                        { $push: { 'work_centers': workCenterId } })
                }
            }
            return newWCenter
        } catch (error) { throwSrvErr(error) }
    }

}