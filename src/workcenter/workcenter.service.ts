import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwCanNotDeleteErr, throwSrvErr } from 'src/common/utils/error';
import { User } from 'src/model/user/user.shema';
import { Resource } from 'src/model/resource/resource.shema';
import { WorkCenter } from 'src/model/workcenter/workcenter.schema';
import { AddWorkCenterDTO } from './dto/add-workcenter.dto';
import { UpdateWorkCenterDTO } from './dto/update-workcenter.dto';
import { WorkCenterResource } from 'src/model/workcenter-resource/workcenter-resource.schema';
import { WorkCenterUser } from 'src/model/workcenter-user/workcenter-user.schema';
import { ProductWorkCenter } from 'src/model/product-workcenter/product-workcenter.schema';
import { UpdateProductWorkCenterDTO } from './dto/update-product-workcenter.dto';
import { generateRandomCode } from 'src/shared/helper';

@Injectable()
export class WorkCenterService {
  constructor(
    @InjectModel('WorkCenter')
    private workCenterModel: PaginateModel<WorkCenter>,
    @InjectModel('Resource') private resourceModel: PaginateModel<Resource>,
    @InjectModel('WorkCenter_Resource')
    private wcResourceModel: PaginateModel<WorkCenterResource>,
    @InjectModel('User') private userModel: PaginateModel<User>,
    @InjectModel('WorkCenter_User')
    private wcUserModel: PaginateModel<WorkCenterUser>,
    @InjectModel('Product_WorkCenter')
    private productWorkCenterService: Model<ProductWorkCenter>,
  ) {}

  async create(workCenterDTO: AddWorkCenterDTO) {
    try {
      const codes = (await this.workCenterModel.find()).map(
        (e) => e.workcenter_no,
      );
      return await new this.workCenterModel({
        workcenter_no: generateRandomCode(codes),
        ...workCenterDTO,
      }).save();
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getList(queryDto: PaginationQueryDto) {
    try {
      const searchRegex = new RegExp(queryDto.search, 'i');
      const query = {
        $or: [
          { name: { $regex: searchRegex } },
          { workcenter_no: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
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
        return await this.workCenterModel.paginate(query, options);
      } else
        return await this.workCenterModel
          .find(query)
          .sort({ created_at: SortQuery.Desc });
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getDetail(workCenterId: string) {
    try {
      const workCenter = await this.checkIsWorkCenterExist(workCenterId);

      const wcResources = await this.wcResourceModel
        .find({ workcenter: workCenterId })
        .populate('resource');
      workCenter['resources'] = wcResources.map((e) => e.resource);
      const wcUsers = await this.wcUserModel
        .find({ workcenter: workCenterId })
        .populate('user');
      workCenter['users'] = wcUsers.map((e) => e.user);

      return workCenter;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async delete(workCenterId: string) {
    try {
      const deletedWorkCenter = await this.workCenterModel.findByIdAndDelete(
        workCenterId,
      );
      if (!deletedWorkCenter)
        throw new NotFoundException('WorkCenter is not exist');
      await this.wcResourceModel.deleteMany({ workCenter: workCenterId });
      await this.wcUserModel.deleteMany({ workcenter: workCenterId });
      await this.productWorkCenterService.deleteMany({
        workCenter: workCenterId,
      });
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async update(workCenterId: string, workCenterDTO: UpdateWorkCenterDTO) {
    try {
      await this.checkIsWorkCenterExist(workCenterId);
      // Add Resource to Work Center
      if (Array.isArray(workCenterDTO.resources)) {
        await this.wcResourceModel.deleteMany({
          workcenter: workCenterId,
        });
        const workCenterResources = workCenterDTO.resources.map(
          (resourceId) => ({
            workcenter: workCenterId,
            resource: resourceId,
          }),
        );
        return await this.wcResourceModel.insertMany(workCenterResources);
      }
      // Add User to Work Center
      else if (Array.isArray(workCenterDTO.users)) {
        await this.wcUserModel.deleteMany({ workcenter: workCenterId });
        const workCenterUsers = workCenterDTO.users.map((userId) => ({
          workcenter: workCenterId,
          user: userId,
        }));
        return await this.wcUserModel.insertMany(workCenterUsers);
      } else {
        const newWCenter = await this.workCenterModel.findByIdAndUpdate(
          workCenterId,
          workCenterDTO,
          { new: true },
        );
        return newWCenter;
      }
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async updateProductWorkCenter(
    workCenterId: string,
    productWorkCenterDTO: UpdateProductWorkCenterDTO,
  ) {
    try {
      await this.checkIsWorkCenterExist(workCenterId);
      const productWorkCenter =
        await this.productWorkCenterService.findOneAndUpdate(
          { workcenter: workCenterId },
          { workcenter: workCenterId, ...productWorkCenterDTO },
          { new: true, upsert: true, setDefaultsOnInsert: true },
        );
      if (!productWorkCenter)
        throw new NotFoundException('Product Work Center is not exist');
      return productWorkCenter;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async checkIsWorkCenterExist(workCenterId: string) {
    try {
      const workCenter = await this.workCenterModel
        .findById(workCenterId)
        .lean();
      if (!workCenter) throw new NotFoundException('WorkCenter is not exist');
      return workCenter;
    } catch (error) {
      throwSrvErr(error);
    }
  }
}
