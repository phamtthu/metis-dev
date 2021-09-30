import { BadRequestException, ConflictException, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, PaginateModel } from "mongoose"
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto"
import { SortQuery } from "src/common/enum/filter.enum"
import { throwSrvErr } from "src/common/utils/error"
import { User } from "src/model/user.shema"
import { Resource } from "src/model/resource.shema"
import { WorkCenter } from "src/model/workcenter.schema"
import { AddWorkCenterDTO } from "./dto/add-workcenter.dto"
import { UpdateWorkCenterDTO } from "./dto/update-workcenter.dto"
import { WorkCenterResource } from "src/model/workcenter-resource.schema"
import { WorkCenterUser } from "src/model/workcenter-user.schema"

@Injectable()
export class WorkCenterService {

    constructor(
        @InjectModel('WorkCenter') private workCenterModel: PaginateModel<WorkCenter>,
        @InjectModel('Resource') private resourceModel: PaginateModel<Resource>,
        @InjectModel('WorkCenter_Resource') private wcResourceModel: PaginateModel<WorkCenterResource>,
        @InjectModel('User') private userModel: PaginateModel<User>,
        @InjectModel('WorkCenter_User') private wcUserModel: PaginateModel<WorkCenterUser>
    ) { }

    async create(workCenterDTO: AddWorkCenterDTO) {
        try {
            const result = await this.workCenterModel.findOne(
                { workcenter_no: workCenterDTO.workcenter_no }
            )
            if (result)
                throw new ConflictException('workcenter_no is already exist')
            return await (new this.workCenterModel(workCenterDTO)).save()
        } catch (error) { throwSrvErr(error) }
    }

    async getList(paginateQuery: PaginationQueryDto, search: string) {
        try {
            const searchRegex = new RegExp(search, 'i')
            const query = {
                $or: [
                    { name: { $regex: searchRegex } },
                    { workcenter_no: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } }
                ]
            }
            if (paginateQuery.offset >= 0 && paginateQuery.limit >= 0) {
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
                return await this.workCenterModel.paginate(query, options)
            } else
                return await this.workCenterModel.find(query)
                    .sort({ 'created_at': SortQuery.Desc })
        } catch (error) { throwSrvErr(error) }
    }

    async getDetail(workCenterId: string) {
        try {
            const workCenter = await this.workCenterModel.findById(workCenterId).lean()
            
            const wcResources = await this.wcResourceModel.find({ workcenter: workCenterId }).populate('resource')
            workCenter['resources'] = wcResources.map((e) => e.resource)
            const wcUsers = await this.wcUserModel.find({ workcenter: workCenterId }).populate('user')
            workCenter['users'] = wcUsers.map((e) => e.user)

            return workCenter
        } catch (error) { throwSrvErr(error) }
    }

    async delete(workCenterId: string) {
        try {
            const wcResources = await this.wcResourceModel.find({ workcenter: workCenterId })
            if (wcResources.length > 0)
                throw new BadRequestException('Can not delete WorkCenter. There are Resource link with this WorkCenter')
            const wcUsers = await this.wcUserModel.find({ workcenter: workCenterId })
            if (wcUsers.length > 0)
                throw new BadRequestException('Can not delete WorkCenter. There are User link with this WorkCenter')

            await this.workCenterModel.findByIdAndDelete(workCenterId)

        } catch (error) { throwSrvErr(error) }
    }

    async update(workCenterId: string, workCenterDTO: UpdateWorkCenterDTO) {
        try {
            // Add Resource to Work Center
            if (Array.isArray(workCenterDTO.resources)) {
                await this.wcResourceModel.deleteMany({ workcenter: workCenterId })
                const workCenterResources = workCenterDTO.resources.map((resourceId) => (
                    { workcenter: workCenterId, resource: resourceId }
                ))
                return await this.wcResourceModel.insertMany(workCenterResources)
            }
            else if (Array.isArray(workCenterDTO.users)) {
                await this.wcUserModel.deleteMany({ workcenter: workCenterId })
                const workCenterUsers = workCenterDTO.users.map((userId) => (
                    { workcenter: workCenterId, user: userId }
                ))
                return await this.wcResourceModel.insertMany(workCenterUsers)
            }
            else {
                const newWCenter = await this.workCenterModel.findByIdAndUpdate(
                    workCenterId, workCenterDTO, { new: true }
                )
                return newWCenter
            }

        } catch (error) { throwSrvErr(error) }
    }

}