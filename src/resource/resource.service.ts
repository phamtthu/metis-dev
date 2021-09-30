import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, Types } from 'mongoose';
import { SortQuery } from 'src/common/enum/filter.enum';
import { User } from 'src/model/user.shema';
import { AddResourceDTO } from './dto/add-resource.dto';
import { UpdateResourceDTO } from './dto/update-resource.dto';
import { Resource } from '../model/resource.shema';
import { throwSrvErr } from 'src/common/utils/error';
import { deleteImgPath, getNewImgLink } from 'src/common/utils/image-handler';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ResourceUser } from 'src/model/resource-user.schema';
import { WorkCenterResource } from 'src/model/workcenter-resource.schema';

@Injectable()
export class ResourceService {
  constructor(
    @InjectModel('Resource') private resourceModel: PaginateModel<Resource>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Resource_User')
    private resourceUserModel: Model<ResourceUser>,
    @InjectModel('WorkCenter_Resource')
    private wcResourceModel: PaginateModel<WorkCenterResource>,
  ) {}

  async create(resourceDTO: AddResourceDTO, originURL: string) {
    try {
      const result = await this.resourceModel.findOne({
        equipment_no: resourceDTO.equipment_no,
      });
      if (result) throw new ConflictException('equipment_no is already exist');
      resourceDTO.images = await Promise.all(
        resourceDTO.images.map(
          async (img) => await getNewImgLink(img, 'resource', originURL),
        ),
      );
      const resource = await new this.resourceModel(resourceDTO).save();
      return resource;
    } catch (e) {
      throwSrvErr(e);
    }
  }

  async getList(paginateQuery: PaginationQueryDto, search: string) {
    try {
      const searchRegex = new RegExp(search, 'i');
      const query = {
        $or: [
          { equipment_name: { $regex: searchRegex } },
          { resource_no: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
        ],
      };
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
            docs: 'data',
          },
        };
        return await this.resourceModel.paginate(query, options);
      } else
        return await this.resourceModel
          .find(query)
          .sort({ created_at: SortQuery.Desc });
    } catch (e) {
      throwSrvErr(e);
    }
  }

  async getDetail(resourceId: string) {
    try {
      // Lean wil remove blank field
      const resource = await this.resourceModel.findById(resourceId).lean();

      const resourceUsers = await this.resourceUserModel
        .find({ resource: resourceId })
        .populate('user');
      resource['users'] = resourceUsers.map((e) => e.user);
      const wcResources = await this.wcResourceModel
        .find({ resource: resourceId })
        .populate('workcenter');
      resource['workcenters'] = wcResources.map((e) => e.workcenter);
      return resource;
    } catch (e) {
      throwSrvErr(e);
    }
  }

  async delete(resourceId: string) {
    try {
      const resourceUsers = await this.resourceUserModel.find({
        resource: resourceId,
      });
      if (resourceUsers.length > 0)
        throw new BadRequestException(
          'Can not delete Resource. There are Users link with this Resource',
        );

      const wcResources = await this.wcResourceModel.find({
        resource: resourceId,
      });
      if (wcResources.length > 0)
        throw new BadRequestException(
          'Can not delete Resource. There are WorkCenter link with this Resource',
        );

      const deletedResource = await this.resourceModel
        .findByIdAndDelete(resourceId)
        .lean();
      // Delete Image
      deletedResource.images.forEach(async (img) => {
        await deleteImgPath(img);
      });
    } catch (e) {
      throwSrvErr(e);
    }
  }

  async update(
    resourceId: string,
    resourceDTO: UpdateResourceDTO,
    originURL: string,
  ) {
    try {
      // Add User to Resource
      if (Array.isArray(resourceDTO.users)) {
        await this.resourceUserModel.deleteMany({ resource: resourceId });
        const resourceUsers = resourceDTO.users.map((userId) => ({
          user: userId,
          resource: resourceId,
        }));
        return await this.resourceUserModel.insertMany(resourceUsers);
      } else {
        if (resourceDTO.images) {
          const oldResource = await this.resourceModel
            .findById(resourceId)
            .lean();
          resourceDTO.images = await Promise.all(
            resourceDTO.images.map(
              async (img) => await getNewImgLink(img, 'resource', originURL),
            ),
          );
          oldResource.images.forEach(async (img) => {
            await deleteImgPath(img);
          });
        }
        const newResource = await this.resourceModel.findByIdAndUpdate(
          resourceId,
          resourceDTO,
          { new: true },
        );
        return newResource;
      }
    } catch (e) {
      throwSrvErr(e);
    }
  }

  async findAllIds() {
    try {
      const resources = await this.resourceModel.find().lean();
      return resources.map((e) => String(e._id));
    } catch (e) {
      throwSrvErr(e);
    }
  }
}
