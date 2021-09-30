import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, PaginateModel } from 'mongoose'
import { User } from '../model/user.shema'
import { Role, SortQuery, Status } from 'src/common/enum/filter.enum'
import { throwSrvErr } from 'src/common/utils/error'
import { AddUserDTO } from './dto/add-user.dto'
import { deleteImgPath, getNewImgLink } from 'src/common/utils/image-handler'
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto'
import { UpdateUserDTO } from './dto/update-user'
import { ResourceUser } from 'src/model/resource-user.schema'
import { Resource } from 'src/model/resource.shema'
import { WorkCenterUser } from 'src/model/workcenter-user.schema'
import { UserResponse } from './response/user-response'

@Injectable()
export class UserService {

    constructor(
        @InjectModel('User') private userModel: PaginateModel<User>,
        @InjectModel('Resource') private resourceModel: PaginateModel<Resource>,
        @InjectModel('Resource_User') private resourceUserModel: Model<ResourceUser>,
        @InjectModel('WorkCenter_User') private wcUserModel: PaginateModel<WorkCenterUser>
    ) { }

    // For admin 
    async adminRegister(admin) {
        try {
            const theAdmin = new this.userModel({
                roles: [Role.Admin],
                is_active: Status.Active,
                ...admin
            })
            await theAdmin.save()
        } catch (e) { throwSrvErr(e) }
    }

    async findUserByEmail(email: string) {
        try {
            return await this.userModel.findOne({ email: email })
        } catch (e) { throwSrvErr(e) }
    }

    async findUserById(userId: string) {
        try {
            // JWT
            return await this.userModel.findById(userId).lean()
        } catch (e) { throwSrvErr(e) }
    }

    public async resetLimitConnect() {
        try {
            const users = await this.userModel.updateMany(
                {},
                {
                    $set: {
                        today_connect_count: 0,
                        last_connect: new Date('2020-01-01T14:24:04.374+0000'),
                    },
                },
                { multi: true },
            );
            console.log('resetLimitConnect', users);
            return users;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    //----------------------------------------------------------------

    async create(userDTO: AddUserDTO, originURL: string) {
        try {
            const user_no = await this.userModel.findOne({ user_no: userDTO.user_no })
            if (user_no)
                throw new ConflictException('user_no is already exist')
            const email = await this.userModel.findOne({ email: userDTO.email })
            if (email)
                throw new ConflictException('email is already exist')
            userDTO.image = await getNewImgLink(
                userDTO.image, 'user', originURL)
            const user = await (new this.userModel(userDTO)).save()
            return new UserResponse(user.toJSON())
            // return user
        } catch (e) { throwSrvErr(e) }
    }

    async getList(paginateQuery: PaginationQueryDto, search: string) {
        try {
            const searchRegex = new RegExp(search, 'i')
            const query = {
                $or: [
                    { name: { $regex: searchRegex } },
                    { email: { $regex: searchRegex } },
                    { user_no: { $regex: searchRegex } },
                    { title: { $regex: searchRegex } }
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
                return await this.userModel.paginate(query, options)
            } else
                return await this.userModel.find(query)
                    .sort({ 'created_at': SortQuery.Desc })
        } catch (e) { throwSrvErr(e) }
    }

    async getDetail(userId: string) {
        try {
            const user = await this.userModel.findById(userId).lean()
            // // Resource
            // const resourceUsers = await this.resourceUserModel.find({ user: userId }).populate('resource')
            // user['resources'] = resourceUsers.map((e) => e.resource)
            // // WorkCenter
            // const wcUsers = await this.wcUserModel.find({ user: userId }).populate('workcenter')
            // user['workcenters'] = wcUsers.map((e) => e.workcenter)
            // return user
            return new UserResponse(user)
        } catch (e) { throwSrvErr(e) }
    }

    async delete(userId: string) {
        try {
            const resourceUsers = await this.resourceUserModel.find({ user: userId })
            if (resourceUsers.length > 0)
                throw new BadRequestException('Can not delete User. There are Resources link with this User')
            const wcUsers = await this.wcUserModel.find({ user: userId })
            if (wcUsers.length > 0)
                throw new BadRequestException('Can not delete User. There are WorkCenter link with this User')
            const deletedUser = await this.userModel.findByIdAndDelete(userId)
            // Delete Image 
            if (deletedUser.image)
                await deleteImgPath(deletedUser.image)
        } catch (e) { throwSrvErr(e) }
    }

    async update(userId: string, userDTO: UpdateUserDTO, originURL: string) {
        try {
            const oldUser = await this.userModel.findById(userId)
            // Delete Image
            await deleteImgPath(oldUser.image)
            // Insert New Image
            if (userDTO.image)
                userDTO.image = await getNewImgLink(
                    userDTO.image, 'user', originURL)
            const newUser = await this.userModel.findByIdAndUpdate(
                userId, userDTO, { new: true }).lean()
            return newUser
            // return new UserResponse(newUser)
        } catch (e) { throwSrvErr(e) }
    }

    async findAllIds() {
        try {
            const users = await this.userModel.find().lean()
            return users.map(user => String(user._id))
        } catch (e) { throwSrvErr(e) }
    }

}