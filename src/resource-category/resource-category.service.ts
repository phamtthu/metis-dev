import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwCanNotDeleteErr, throwSrvErr } from 'src/common/utils/error';
import { deleteImgPath, getNewImgLink } from 'src/common/utils/image-handler';
import { Resource } from 'src/model/resource/resource.shema';
import { ResourceCategory } from 'src/model/resource-category/resource-category.schema';
import { getNestedList, paginator } from 'src/shared/helper';
import { AddRCategoryDTO } from './dto/add-resource-category.dto';
import { UpdateRCategoryRDTO } from './dto/update-resource-category.dto';

@Injectable()
export class ResourceCategoryService {
  constructor(
    @InjectModel('Resource_Category')
    private resourceCategoryModel: PaginateModel<ResourceCategory>,
    @InjectModel('Resource')
    private resourceModel: Model<Resource>,
  ) {}

  async create(rCategoryDTO: AddRCategoryDTO, originURL: string) {
    try {
      rCategoryDTO.image = await getNewImgLink(
        rCategoryDTO.image,
        'resource-category',
        originURL,
      );
      return await new this.resourceCategoryModel(rCategoryDTO).save();
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
          { description: { $regex: searchRegex } },
        ],
      };
      if (queryDto.search) {
        const paginationOptions = {
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
        if (queryDto.offset >= 0 && queryDto.limit >= 0) {
          return await this.resourceCategoryModel.paginate(
            query,
            paginationOptions,
          );
        } else {
          return await this.resourceCategoryModel
            .find(query)
            .sort({ created_at: SortQuery.Desc });
        }
      } else {
        const categories = await this.resourceCategoryModel
          .find()
          .sort({ created_at: SortQuery.Desc })
          .lean();
        const nestedCategories = getNestedList(null, categories);
        if (queryDto.offset >= 0 && queryDto.limit >= 0) {
          return paginator(nestedCategories, queryDto.offset, queryDto.limit);
        } else {
          return nestedCategories;
        }
      }
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getDetail(categoryId: string) {
    try {
      const theCategory: any = await this.checkIsResourceCategoryExist(
        categoryId,
      );
      const categories: any = await this.resourceCategoryModel
        .find()
        .sort({ created_at: SortQuery.Desc })
        .lean();
      let rootAndsubCategories = await this.getAllSubCategoriesFromRootCategory(
        theCategory,
        categories,
      );
      theCategory['sub_categoriesID'] = rootAndsubCategories.map((e) => e._id);
      theCategory['children'] = getNestedList(categoryId, categories);
      return theCategory;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getAllSubCategoriesFromRootCategory(
    theCategory: ResourceCategory,
    categories: ResourceCategory[],
  ) {
    try {
      theCategory['children'] = getNestedList(theCategory._id, categories);
      // Flat Nested array and return Products[]
      const flatten = (arr) =>
        arr.flatMap(({ children, ...o }) => [o, ...flatten(children)]);
      return flatten([theCategory]);
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async delete(categoryId: string) {
    const deletedCategory = await this.checkIsResourceCategoryExist(categoryId);
    const relatedResources = await this.resourceModel.find({
      category: categoryId,
    });
    if (relatedResources.length > 0)
      throwCanNotDeleteErr('Resource Category', 'Resource');
    await this.resourceCategoryModel.findByIdAndDelete(categoryId);
    // Change parent_id of its Sub Category to null
    await this.resourceCategoryModel.updateMany(
      { parent: categoryId },
      { parent: null },
    );
    if (deletedCategory.image) await deleteImgPath(deletedCategory.image);
  }

  async update(
    categoryId: string,
    rCategoryDTO: UpdateRCategoryRDTO,
    originURL: string,
  ) {
    const oldResourceCategory = await this.checkIsResourceCategoryExist(
      categoryId,
    );
    rCategoryDTO.image = await getNewImgLink(
      rCategoryDTO.image,
      'resource-category',
      originURL,
    );
    const newResourceCategory =
      await this.resourceCategoryModel.findByIdAndUpdate(
        categoryId,
        rCategoryDTO,
        { new: true },
      );
    // Delete old Image
    await deleteImgPath(oldResourceCategory.image);
    return newResourceCategory;
  }

  async getResourceFromGivenPCategory(categoryId: string) {
    let { sub_categoriesID }: any = await this.getDetail(categoryId);
    sub_categoriesID = sub_categoriesID.map((e) => String(e));
    return await this.resourceModel.find({
      category: { $in: sub_categoriesID },
    });
  }

  async checkIsResourceCategoryExist(categoryId: string) {
    try {
      const category = await this.resourceCategoryModel
        .findById(categoryId)
        .lean();
      if (!category)
        throw new NotFoundException('Resource Category is not exist');
      return category;
    } catch (error) {
      throwSrvErr(error);
    }
  }
}
