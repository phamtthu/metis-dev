import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwCanNotDeleteErr, errorException } from 'src/common/utils/error';
import { User } from 'src/model/user/user.shema';
import { Resource } from 'src/model/resource/resource.shema';
import { WorkCenter } from 'src/model/workcenter/workcenter.schema';
import { AddWorkCenterDTO } from './dto/add-workcenter.dto';
import { UpdateWorkCenterDTO } from './dto/update-workcenter.dto';
import { WorkCenterResource } from 'src/model/workcenter-resource/workcenter-resource.schema';
import { WorkCenterUser } from 'src/model/workcenter-user/workcenter-user.schema';
import { ProductWorkCenter } from 'src/model/product-workcenter/product-workcenter.schema';
import { UpdateProductWorkCenterDTO } from './dto/update-product-workcenter.dto';
import { generateRandomCode, paginator, toJsObject } from 'src/shared/helper';
import { classToPlain } from 'class-transformer';
import { WorkCenterResponse } from './response/workcenter-response';
import { WorkCentersResponse } from './response/workcenters-response';
import { WorkCenterDetailResponse } from './response/workcenter-detail-response';
import { WorkCenterResourceResponse } from './response/workcenter-resource-response';
import { WorkCenterUserResponse } from './response/workcenter-user-response';
import { ProductWorkCenterResponse } from 'src/product-workcenter/response/product-workcenter-response';
import { Product } from 'src/model/product/product.schema';
import { Board } from 'src/model/board/board-schema';

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
    private productWorkCenterModel: Model<ProductWorkCenter>,
    @InjectModel('Product')
    private productModel: Model<Product>,
    @InjectModel('Board')
    private boardModel: Model<Board>,
  ) {}

  async create(workCenterDTO: AddWorkCenterDTO) {
    try {
      const codes = (await this.workCenterModel.find()).map(
        (e) => e.workcenter_no,
      );
      const workCenter = await new this.workCenterModel({
        workcenter_no: generateRandomCode(codes),
        ...workCenterDTO,
      }).save();
      return classToPlain(new WorkCenterResponse(toJsObject(workCenter)));
    } catch (error) {
      errorException(error);
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
        const workCenters = await this.workCenterModel.paginate(query, options);
        return classToPlain(new WorkCentersResponse(toJsObject(workCenters)));
      } else {
        const workCenters = await this.workCenterModel
          .find(query)
          .sort({ created_at: SortQuery.Desc });
        return classToPlain(
          new WorkCentersResponse(
            toJsObject(paginator(workCenters, 0, workCenters.length)),
          ),
        );
      }
    } catch (error) {
      errorException(error);
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
      const productWorkCenters = await this.productWorkCenterModel.find({
        workcenter: workCenterId,
      });
      workCenter['productWorkCenters'] = productWorkCenters;
      return classToPlain(new WorkCenterDetailResponse(toJsObject(workCenter)));
    } catch (error) {
      errorException(error);
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
      await this.productWorkCenterModel.deleteMany({
        workCenter: workCenterId,
      });
    } catch (error) {
      errorException(error);
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
        const workCenterResources = await this.wcResourceModel.insertMany(
          workCenterDTO.resources.map((resourceId) => ({
            workcenter: workCenterId,
            resource: resourceId,
          })),
        );
        return workCenterResources.map((e) => {
          return classToPlain(new WorkCenterResourceResponse(toJsObject(e)));
        });
      }
      // Add User to Work Center
      else if (Array.isArray(workCenterDTO.users)) {
        await this.wcUserModel.deleteMany({ workcenter: workCenterId });
        const workCenterUsers = await this.wcUserModel.insertMany(
          workCenterDTO.users.map((userId) => ({
            workcenter: workCenterId,
            user: userId,
          })),
        );
        return workCenterUsers.map((e) => {
          return classToPlain(new WorkCenterUserResponse(toJsObject(e)));
        });
      } else {
        const newWCenter = await this.workCenterModel.findByIdAndUpdate(
          workCenterId,
          workCenterDTO,
          { new: true },
        );
        return classToPlain(new WorkCenterResponse(toJsObject(newWCenter)));
      }
    } catch (error) {
      errorException(error);
    }
  }

  async updateProductWorkCenter(
    workCenterId: string,
    productWorkCenterDTO: UpdateProductWorkCenterDTO,
  ) {
    try {
      const workcenter = await this.checkWorkCenterExist(workCenterId);
      const product = await this.checkProductExist(
        productWorkCenterDTO.product,
      );

      const productWorkCenter =
        await this.productWorkCenterModel.findOneAndUpdate(
          { workcenter: workCenterId, product: productWorkCenterDTO.product },
          { workcenter: workCenterId, ...productWorkCenterDTO },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
            rawResult: true,
          },
        );
      if (!productWorkCenter)
        throw new Error('Can not update Product WorkCenter');
      if (productWorkCenter.lastErrorObject.updatedExisting === false) {
        const boardName = `Board for ${workcenter.name} - ${product.name}`;
        const board = await this.boardModel.create({ name: boardName });
        await this.productWorkCenterModel.findByIdAndUpdate(
          productWorkCenter.value._id,
          { board: board._id },
        );
      }
      return classToPlain(
        new ProductWorkCenterResponse(toJsObject(productWorkCenter.value)),
      );
    } catch (error) {
      errorException(error);
    }
  }

  async checkWorkCenterExist(workCenterId: string) {
    try {
      const workCenter = await this.workCenterModel
        .findById(workCenterId)
        .lean();
      if (!workCenter) throw new NotFoundException('WorkCenter is not exist');
      return workCenter;
    } catch (error) {
      errorException(error);
    }
  }

  async checkProductExist(productId: string) {
    try {
      const product = await this.productModel.findById(productId).lean();
      if (!product) throw new NotFoundException('Product is not exist');
      return product;
    } catch (error) {
      errorException(error);
    }
  }
}
