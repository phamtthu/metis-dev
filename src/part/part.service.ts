import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwCanNotDeleteErr, errorException } from 'src/common/utils/error';
import { Product } from 'src/model/product/product.schema';
import { Part } from 'src/model/part/part.schema';
import { AddPartDTO } from './dto/add-part.dto';
import { UpdatePartDTO } from './dto/update-part.dto';
import { ProductPart } from 'src/model/product-part/product-part.schema';
import { generateRandomCode, paginator, toJsObject } from 'src/shared/helper';
import { PartResponse } from './response/part-response';
import { classToPlain } from 'class-transformer';
import { PartsResponse } from './response/parts-response';
import { PartDetailResponse } from './response/part-detail-response';

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
      const codes = (await this.partModel.find()).map((e) => e.material_no);
      const part = await new this.partModel({
        material_no: generateRandomCode(codes),
        ...productPartDTO,
      }).save();
      return classToPlain(new PartResponse(toJsObject(part)));
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
        const parts = await this.partModel.paginate(query, options);
        return classToPlain(new PartsResponse(toJsObject(parts)));
      } else {
        const parts = await this.partModel
          .find(query)
          .sort({ created_at: SortQuery.Desc });
        return classToPlain(
          new PartsResponse(toJsObject(paginator(parts, 0, parts.length))),
        );
      }
    } catch (error) {
      errorException(error);
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
      return classToPlain(new PartDetailResponse(toJsObject(part)));
    } catch (error) {
      errorException(error);
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
      errorException(error);
    }
  }

  async update(partId: string, productPartDTO: UpdatePartDTO) {
    try {
      const part = await this.partModel.findByIdAndUpdate(
        partId,
        productPartDTO,
        {
          new: true,
        },
      );
      return classToPlain(new PartResponse(toJsObject(part)));
    } catch (error) {
      errorException(error);
    }
  }

  async findAllIds() {
    try {
      const productParts = await this.partModel.find().lean();
      return productParts.map((productPart) => String(productPart._id));
    } catch (e) {
      errorException(e);
    }
  }
}
