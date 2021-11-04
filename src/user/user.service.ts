import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { User } from '../model/user/user.shema';
import { Role, SortQuery, Status } from 'src/common/enum/filter.enum';
import { throwCanNotDeleteErr, errorException } from 'src/common/utils/error';
import { AddUserDTO } from './dto/add-user.dto';
import { deleteImgPath, getNewImgLink } from 'src/common/utils/image-handler';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { UpdateUserDTO } from './dto/update-user';
import { ResourceUser } from 'src/model/resource-user/resource-user.schema';
import { Resource } from 'src/model/resource/resource.shema';
import { WorkCenterUser } from 'src/model/workcenter-user/workcenter-user.schema';
import { SequenceUser } from 'src/model/sequence-user/sequence-user.schema';
import { TaskUser } from 'src/model/task-user/taskuser.schema';
import { Task } from 'src/model/task/task.schema';
import { ProductWorkCenter } from 'src/model/product-workcenter/product-workcenter.schema';
import {
  bcryptPassword,
  generateRandomCode,
  paginator,
  toJsObject,
} from 'src/shared/helper';
import { UserResponse } from './response/response/user-response';
import { classToPlain } from 'class-transformer';
import { UserDetailResponse } from './response/response/user-detail.response';
import { UsersResponse } from './response/response/users-response';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: PaginateModel<User>,
    @InjectModel('Resource')
    private resourceModel: PaginateModel<Resource>,
    @InjectModel('Resource_User')
    private resourceUserModel: Model<ResourceUser>,
    @InjectModel('WorkCenter_User')
    private wcUserModel: PaginateModel<WorkCenterUser>,
    @InjectModel('Sequence_User')
    private sequenceUserModel: Model<SequenceUser>,
    @InjectModel('Task')
    private taskModel: PaginateModel<Task>,
    @InjectModel('Task_User')
    private taskUserModel: Model<TaskUser>,
    @InjectModel('Product_WorkCenter')
    private productWorkCenterService: Model<ProductWorkCenter>,
  ) {}

  // For admin
  async adminRegister(admin) {
    try {
      const theAdmin = new this.userModel({
        roles: [Role.Admin, Role.Employee],
        is_active: Status.Active,
        tag_name: '@admin',
        ...admin,
      });
      await theAdmin.save();
    } catch (e) {
      errorException(e);
    }
  }

  async findUserByEmail(email: string) {
    try {
      return await this.userModel.findOne({ email: email }).lean();
    } catch (e) {
      errorException(e);
    }
  }

  async findUserById(userId: string) {
    try {
      // JWT
      return await this.userModel.findById(userId).lean();
    } catch (e) {
      errorException(e);
    }
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
      const codes = (await this.userModel.find()).map((e) => e.user_no);
      const email = await this.userModel.findOne({ email: userDTO.email });
      if (email) throw new ConflictException('email is already exist');
      userDTO.image = await getNewImgLink(userDTO.image, 'user', originURL);
      userDTO.password = await bcryptPassword(userDTO.password);
      const user = await new this.userModel({
        tag_name: await this.getUserTagname(userDTO.email),
        user_no: generateRandomCode(codes),
        ...userDTO,
      }).save();
      return classToPlain(new UserResponse(toJsObject(user)));
    } catch (e) {
      errorException(e);
    }
  }

  async getUserTagname(email) {
    try {
      const users = await this.userModel.find().lean();
      const tagNames = users.map((user) => user.tag_name);
      let tagName = email.split('@')[0];
      while (tagNames.includes(tagName)) {
        const numbers = '0123456789';
        for (let i = 0; i < 3; i++) {
          var rnd = Math.floor(Math.random() * numbers.length);
          tagName = tagName + numbers.charAt(rnd);
        }
      }
      return tagName;
    } catch (e) {
      errorException(e);
    }
  }

  async getList(queryDto: PaginationQueryDto) {
    try {
      const searchRegex = new RegExp(queryDto.search, 'i');
      const query = {
        $or: [
          { name: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
          { user_no: { $regex: searchRegex } },
          { title: { $regex: searchRegex } },
        ],
      };
      if (queryDto.offset >= 0 && queryDto.limit >= 0) {
        const options = {
          offset: queryDto.offset,
          limit: queryDto.limit,
          sort: { created_at: SortQuery.Desc },
          customLabels: {
            page: 'page',
            limit: 'per_page',
            totalDocs: 'total',
            totalPages: 'total_pages',
            docs: 'data',
          },
        };
        const users = await this.userModel.paginate(query, options);
        return classToPlain(new UsersResponse(toJsObject(users)));
      } else {
        const users = await this.userModel
          .find(query)
          .sort({ created_at: SortQuery.Desc });
        return classToPlain(
          new UsersResponse(toJsObject(paginator(users, 0, users.length))),
        );
      }
    } catch (e) {
      errorException(e);
    }
  }

  async getDetail(userId: string) {
    try {
      const user = await this.checkIsUserExist(userId);
      const resourceUsers = await this.resourceUserModel
        .find({ user: userId })
        .populate('resource');
      user['resources'] = resourceUsers.map((e) => e.resource);
      const wcUsers = await this.wcUserModel
        .find({ user: userId })
        .populate('workcenter');
      user['workcenters'] = wcUsers.map((e) => e.workcenter);
      const sequenceUsers = await this.sequenceUserModel
        .find({ user: userId })
        .populate('sequence');
      user['sequences'] = sequenceUsers.map((e) => e.sequence);
      const tasks = await this.taskUserModel
        .find({ user: userId })
        .populate('task');
      user['tasks'] = tasks.map((e) => e.task);
      return classToPlain(new UserDetailResponse(toJsObject(user)));
    } catch (e) {
      errorException(e);
    }
  }

  async delete(userId: string) {
    try {
      await this.checkIsUserExist(userId);
      const relatedResources = await this.resourceUserModel.find({
        user: userId,
      });
      if (relatedResources.length > 0) throwCanNotDeleteErr('User', 'Resource');
      const relatedWorkCenters = await this.wcUserModel.find({
        user: userId,
      });
      if (relatedWorkCenters.length > 0)
        throwCanNotDeleteErr('User', 'WorkCenter');
      const relatedSequences = await this.sequenceUserModel.find({
        user: userId,
      });
      if (relatedSequences.length > 0) throwCanNotDeleteErr('User', 'Sequence');
      const relatedTasks = await this.taskUserModel.find({ user: userId });
      if (relatedTasks.length > 0) throwCanNotDeleteErr('User', 'Task');
      const relatedProductWorkCenters =
        await this.productWorkCenterService.find({ users: userId });
      if (relatedProductWorkCenters.length > 0)
        throwCanNotDeleteErr('User', 'Product WorkCenter');
      const deletedUser = await this.userModel.findByIdAndDelete(userId);
      if (deletedUser.image) await deleteImgPath(deletedUser.image);
    } catch (e) {
      errorException(e);
    }
  }

  async update(userId: string, userDTO: UpdateUserDTO, originURL: string) {
    try {
      const oldUser = await this.checkIsUserExist(userId);
      await deleteImgPath(oldUser.image);
      if (userDTO.image)
        userDTO.image = await getNewImgLink(userDTO.image, 'user', originURL);
      const newUser = await this.userModel.findByIdAndUpdate(userId, userDTO, {
        new: true,
      });
      return classToPlain(new UserResponse(toJsObject(newUser)));
    } catch (e) {
      errorException(e);
    }
  }

  async findAllIds() {
    try {
      const users = await this.userModel.find().lean();
      return users.map((user) => String(user._id));
    } catch (e) {
      errorException(e);
    }
  }

  async checkIsUserExist(userId: string) {
    try {
      const user = await this.userModel.findById(userId).lean();
      if (!user) throw new NotFoundException('User is not exist');
      return user;
    } catch (error) {
      errorException(error);
    }
  }
}
