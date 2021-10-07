import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwCanNotDeleteErr, errorException } from 'src/common/utils/error';
import { deleteImgPath, getNewImgLink } from 'src/common/utils/image-handler';
import { Resource } from 'src/model/resource/resource.shema';
import { ResourceCategory } from 'src/model/resource-category/resource-category.schema';
import { getNestedList, paginator, toJsObject } from 'src/shared/helper';
import { AddRCategoryDTO } from './dto/add-resource-category.dto';
import { UpdateRCategoryRDTO } from './dto/update-resource-category.dto';
import { classToPlain } from 'class-transformer';
import { ResourceCategoryResponse } from './response/resource-category-response';
import { ResourceCategoriesResponse } from './response/resource-categories-response';
import { ResourceCategoryDetailResponse } from './response/resource-category-detail-response';
import { ResourceResponse } from 'src/resource/response/resource-response';

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
      const category = await new this.resourceCategoryModel(
        rCategoryDTO,
      ).save();
      return classToPlain(new ResourceCategoryResponse(toJsObject(category)));
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
          const categories = await this.resourceCategoryModel.paginate(
            query,
            paginationOptions,
          );
          return classToPlain(
            new ResourceCategoriesResponse(toJsObject(categories)),
          );
        } else {
          const categories = await this.resourceCategoryModel
            .find(query)
            .sort({ created_at: SortQuery.Desc });
          return classToPlain(
            new ResourceCategoriesResponse(
              toJsObject(paginator(categories, 0, categories.length)),
            ),
          );
        }
      } else {
        const categories = await this.resourceCategoryModel
          .find()
          .sort({ created_at: SortQuery.Desc })
          .lean();
        const nestedCategories = getNestedList(null, categories);
        if (queryDto.offset >= 0 && queryDto.limit >= 0) {
          return classToPlain(
            new ResourceCategoriesResponse(
              toJsObject(
                paginator(nestedCategories, queryDto.offset, queryDto.limit),
              ),
            ),
          );
        } else {
          return nestedCategories.map((category) =>
            classToPlain(
              new ResourceCategoryResponse(
                toJsObject(
                  paginator(nestedCategories, 0, nestedCategories.length),
                ),
              ),
            ),
          );
        }
      }
    } catch (error) {
      errorException(error);
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
      return classToPlain(
        new ResourceCategoryDetailResponse(toJsObject(theCategory)),
      );
    } catch (error) {
      errorException(error);
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
      errorException(error);
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
    return classToPlain(
      new ResourceCategoryResponse(toJsObject(newResourceCategory)),
    );
  }

  async getResourceFromGivenPCategory(categoryId: string) {
    let { sub_categoriesID }: any = await this.getDetail(categoryId);
    sub_categoriesID = sub_categoriesID.map((e) => String(e));
    const resources = await this.resourceModel.find({
      category: { $in: sub_categoriesID },
    });
    return resources.map((resource) =>
      classToPlain(new ResourceResponse(toJsObject(resource))),
    );
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
      errorException(error);
    }
  }
}
