import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwCanNotDeleteErr, throwSrvErr } from 'src/common/utils/error';
import { deleteImgPath, getNewImgLink } from 'src/common/utils/image-handler';
import { ProductCategory } from 'src/model/product-category/product-category.schema';
import { Product } from 'src/order/dto/add-order.dto';
import { getNestedList, paginator } from 'src/shared/helper';
import { AddPCategoryDTO } from './dto/add-product-category.dto';
import { UpdatePCategoryRDTO } from './dto/update-product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectModel('Product_Category')
    private productCategoryModel: PaginateModel<ProductCategory>,
    @InjectModel('Product')
    private productModel: Model<Product>,
  ) {}

  async create(pCategoryDTO: AddPCategoryDTO, originURL: string) {
    try {
      pCategoryDTO.image = await getNewImgLink(
        pCategoryDTO.image,
        'product-category',
        originURL,
      );
      return await new this.productCategoryModel(pCategoryDTO).save();
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
          return await this.productCategoryModel.paginate(
            query,
            paginationOptions,
          );
        } else {
          return await this.productCategoryModel
            .find(query)
            .sort({ created_at: SortQuery.Desc });
        }
      } else {
        const categories = await this.productCategoryModel
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
      const theCategory: any = await this.checkIsProductCategoryExist(
        categoryId,
      );
      const categories: any = await this.productCategoryModel
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
    theCategory: ProductCategory,
    categories: ProductCategory[],
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
    try {
      const deletedRCategory = await this.checkIsProductCategoryExist(
        categoryId,
      );
      const relatedProducts = await this.productModel.find({
        category: categoryId,
      });
      if (relatedProducts.length > 0) {
        throwCanNotDeleteErr('Product Category', 'Product');
      }
      await this.productCategoryModel.findByIdAndDelete(categoryId);
      // Change parent_id of its Sub Category to null
      await this.productCategoryModel.updateMany(
        { parent: categoryId },
        { parent: null },
      );
      if (deletedRCategory.image) await deleteImgPath(deletedRCategory.image);
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
      const beforeUpdate = await this.checkIsProductCategoryExist(categoryId);
      pCategoryDTO.image = await getNewImgLink(
        pCategoryDTO.image,
        'product-category',
        originURL,
      );
      await deleteImgPath(beforeUpdate.image);
      return await this.productCategoryModel.findByIdAndUpdate(
        categoryId,
        pCategoryDTO,
      );
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getProductFromGivenPCategory(categoryId: string) {
    try {
      let { sub_categoriesID }: any = await this.getDetail(categoryId);
      sub_categoriesID = sub_categoriesID.map((e) => String(e));
      return await this.productModel.find({
        category: { $in: sub_categoriesID },
      });
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async checkIsProductCategoryExist(categoryId: string) {
    try {
      const productCategory = await this.productCategoryModel
        .findById(categoryId)
        .lean();
      if (!productCategory)
        throw new NotFoundException('Product Category is not exist');
      return productCategory;
    } catch (error) {
      throwSrvErr(error);
    }
  }
}
