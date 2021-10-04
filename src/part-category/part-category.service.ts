import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwCanNotDeleteErr, throwSrvErr } from 'src/common/utils/error';
import { deleteImgPath, getNewImgLink } from 'src/common/utils/image-handler';
import { PartCategory } from 'src/model/part-category/part-category.schema';
import { Part } from 'src/model/part/part.schema';
import { getNestedList, paginator } from 'src/shared/helper';
import { AddPCategoryDTO } from './dto/add-part-category.dto';
import { UpdatePCategoryRDTO } from './dto/update-part-category.dto';

@Injectable()
export class PartCategoryService {
  constructor(
    @InjectModel('Part_Category')
    private partCategoryModel: PaginateModel<PartCategory>,
    @InjectModel('Part') private partModel: Model<Part>,
  ) {}

  async create(pCategoryDTO: AddPCategoryDTO, originURL: string) {
    try {
      pCategoryDTO.image = await getNewImgLink(
        pCategoryDTO.image,
        'part-category',
        originURL,
      );
      return await new this.partCategoryModel(pCategoryDTO).save();
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
          return await this.partCategoryModel.paginate(
            query,
            paginationOptions,
          );
        } else {
          return await this.partCategoryModel
            .find(query)
            .sort({ created_at: SortQuery.Desc });
        }
      } else {
        const categories = await this.partCategoryModel
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
      const theCategory: any = await this.checkIsPartCategoryExist(categoryId);
      const categories: any = await this.partCategoryModel
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
    theCategory: PartCategory,
    categories: PartCategory[],
  ) {
    try {
      theCategory['children'] = getNestedList(theCategory._id, categories);
      // Flat Nested array and return Parts[]
      const flatten = (arr) =>
        arr.flatMap(({ children, ...o }) => [o, ...flatten(children)]);
      return flatten([theCategory]);
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async delete(categoryId: string) {
    try {
      const deletedCategory = await this.checkIsPartCategoryExist(categoryId);
      const relatedParts = await this.partModel.find({
        category: categoryId,
      });
      if (relatedParts.length > 0)
        throwCanNotDeleteErr('Part Category', 'Part');
      await this.partCategoryModel.findByIdAndDelete(categoryId);
      // Change parent_id of its Sub Category to null
      await this.partCategoryModel.updateMany(
        { parent: categoryId },
        { parent: null },
      );
      if (deletedCategory.image) await deleteImgPath(deletedCategory.image);
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async update(
    categoryId: string,
    pCategoryDTO: UpdatePCategoryRDTO,
    originURL: string,
  ) {
    try {
      const beforeUpdate = await this.checkIsPartCategoryExist(categoryId);
      pCategoryDTO.image = await getNewImgLink(
        pCategoryDTO.image,
        'part-category',
        originURL,
      );
      await deleteImgPath(beforeUpdate.image);
      return await this.partCategoryModel.findByIdAndUpdate(
        categoryId,
        pCategoryDTO,
        { new: true },
      );
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getPartFromGivenPartCategory(categoryId: string) {
    try {
      let { sub_categoriesID }: any = await this.getDetail(categoryId);
      sub_categoriesID = sub_categoriesID.map((e) => String(e));
      return await this.partModel.find({
        category: { $in: sub_categoriesID },
      });
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async checkIsPartCategoryExist(categoryId: string) {
    try {
      const category = await this.partCategoryModel.findById(categoryId).lean();
      if (!category) throw new NotFoundException('Part Category is not exist');
      return category;
    } catch (error) {
      throwSrvErr(error);
    }
  }
}
