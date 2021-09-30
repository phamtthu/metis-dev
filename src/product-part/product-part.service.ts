import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwSrvErr } from 'src/common/utils/error';
import { User } from 'src/model/user.shema';
import { Product } from 'src/model/product.schema';
import { ProductPart } from 'src/model/productpart.schema';
import { AddProductPartDTO } from './dto/add-product-part.dto';
import { UpdateProductPartDTO } from './dto/update-product-part.dto';

@Injectable()
export class ProductPartService {
  constructor(
    @InjectModel('Product_Part')
    private productPartModel: PaginateModel<ProductPart>,
    @InjectModel('Product') private productModel: PaginateModel<Product>,
  ) {}

  async create(productPartDTO: AddProductPartDTO) {
    try {
      return await new this.productPartModel(productPartDTO).save();
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getList(paginateQuery: PaginationQueryDto, search: string) {
    try {
      const searchRegex = new RegExp(search, 'i');
      const query = { name: { $regex: searchRegex } };

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
        return await this.productPartModel.paginate(query, options);
      } else
        return await this.productPartModel
          .find(query)
          .sort({ created_at: SortQuery.Desc });
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getDetail(productPartId: string) {
    try {
      return await this.productPartModel.findById(productPartId);
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async delete(productPartId: string) {
    try {
      const deletedProductPart = await this.productPartModel.findByIdAndDelete(
        productPartId,
      );
      // Product
      await this.productModel.updateMany(
        { _id: { $in: deletedProductPart.products } },
        { $pull: { parts: productPartId } },
      );
      return deletedProductPart;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async update(productPartId: string, productPartDTO: UpdateProductPartDTO) {
    try {
      return await this.productPartModel.findByIdAndUpdate(
        productPartId,
        productPartDTO,
        { new: true },
      );
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async findAllIds() {
    try {
      const productParts = await this.productPartModel.find().lean();
      return productParts.map((productPart) => String(productPart._id));
    } catch (e) {
      throwSrvErr(e);
    }
  }
}
