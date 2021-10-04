import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwCanNotDeleteErr, throwSrvErr } from 'src/common/utils/error';
import { Product } from 'src/model/product/product.schema';
import { Part } from 'src/model/part/part.schema';
import { AddPartDTO } from './dto/add-part.dto';
import { UpdatePartDTO } from './dto/update-part.dto';
import { ProductPart } from 'src/model/product-part/product-part.schema';

@Injectable()
export class PartService {
  constructor(
    @InjectModel('Part') private partModel: PaginateModel<Part>,
    @InjectModel('Product') private productModel: PaginateModel<Product>,
    @InjectModel('Part')
    private productPartModel: PaginateModel<ProductPart>,
  ) {}

  async create(productPartDTO: AddPartDTO) {
    try {
      return await new this.partModel(productPartDTO).save();
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
          { material_no: { $regex: searchRegex } },
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
        return await this.partModel.paginate(query, options);
      } else
        return await this.partModel
          .find(query)
          .sort({ created_at: SortQuery.Desc });
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async getDetail(partId: string) {
    try {
      const part = await this.partModel
        .findById(partId)
        .populate('category')
        .lean();
      const productParts = await this.productPartModel
        .find({ part: partId })
        .populate('product');
      part['products'] = productParts.map((e) => e.product);
      return part;
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async delete(partId: string) {
    try {
      const relatedProducts = await this.productPartModel.find({
        part: partId,
      });
      if (relatedProducts.length > 0) throwCanNotDeleteErr('Part', 'Product');
      await this.partModel.findByIdAndDelete(partId);
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async update(partId: string, productPartDTO: UpdatePartDTO) {
    try {
      return await this.partModel.findByIdAndUpdate(partId, productPartDTO, {
        new: true,
      });
    } catch (error) {
      throwSrvErr(error);
    }
  }

  async findAllIds() {
    try {
      const productParts = await this.partModel.find().lean();
      return productParts.map((productPart) => String(productPart._id));
    } catch (e) {
      throwSrvErr(e);
    }
  }
}
