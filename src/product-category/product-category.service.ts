import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { classToPlain } from 'class-transformer';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwCanNotDeleteErr, errorException } from 'src/common/utils/error';
import { deleteImgPath, getNewImgLink } from 'src/common/utils/image-handler';
import { ProductCategory } from 'src/model/product-category/product-category.schema';
import { Product } from 'src/order/dto/add-order.dto';
import { ProductsResponse } from 'src/product/response/products-response';
import { getNestedList, paginator, toJsObject } from 'src/shared/helper';
import { AddPCategoryDTO } from './dto/add-product-category.dto';
import { UpdatePCategoryRDTO } from './dto/update-product-category.dto';
import { ProductCategoriesResponse } from './response/product-categories-response';
import { ProductCategoryDetailResponse } from './response/product-category-detail-response';
import { ProductCategoryResponse } from './response/product-category-response';

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
      const category = await new this.productCategoryModel(pCategoryDTO).save();
      return classToPlain(new ProductCategoryResponse(toJsObject(category)));
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
          const categories = await this.productCategoryModel.paginate(
            query,
            paginationOptions,
          );
          return classToPlain(
            new ProductCategoriesResponse(toJsObject(categories)),
          );
        } else {
          const categories = await this.productCategoryModel
            .find(query)
            .sort({ created_at: SortQuery.Desc });
          return classToPlain(
            new ProductCategoriesResponse(
              toJsObject(paginator(categories, 0, categories.length)),
            ),
          );
        }
      } else {
        const categories = await this.productCategoryModel
          .find()
          .sort({ created_at: SortQuery.Desc })
          .lean();
        const nestedCategories = getNestedList(null, categories);
        if (queryDto.offset >= 0 && queryDto.limit >= 0) {
          return classToPlain(
            new ProductCategoriesResponse(
              toJsObject(
                paginator(nestedCategories, queryDto.offset, queryDto.limit),
              ),
            ),
          );
        } else {
          return classToPlain(
            new ProductCategoriesResponse(
              toJsObject(
                paginator(nestedCategories, 0, nestedCategories.length),
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
      return classToPlain(
        new ProductCategoryDetailResponse(toJsObject(theCategory)),
      );
    } catch (error) {
      errorException(error);
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
      errorException(error);
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
      errorException(error);
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
      const newCategory = await this.productCategoryModel.findByIdAndUpdate(
        categoryId,
        pCategoryDTO,
        { new: true },
      );
      await deleteImgPath(beforeUpdate.image);
      return classToPlain(new ProductCategoryResponse(toJsObject(newCategory)));
    } catch (error) {
      errorException(error);
    }
  }

  async getProductFromGivenPCategory(categoryId: string) {
    try {
      let { sub_categoriesID }: any = await this.getDetail(categoryId);
      sub_categoriesID = sub_categoriesID.map((e) => String(e));
      const products = await this.productModel.find({
        category: { $in: sub_categoriesID },
      });
      return classToPlain(
        new ProductsResponse(
          toJsObject(paginator(products, 0, products.length)),
        ),
      );
    } catch (error) {
      errorException(error);
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
      errorException(error);
    }
  }
}
