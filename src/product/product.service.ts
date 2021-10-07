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
import { deleteImgPath, getNewImgLink } from 'src/common/utils/image-handler';
import { Order } from 'src/model/order/order.schema';
import { Product } from 'src/model/product/product.schema';
import { Part } from 'src/model/part/part.schema';
import { ProductWorkCenter } from 'src/model/product-workcenter/product-workcenter.schema';
import { Task } from 'src/model/task/task.schema';
import { AddProductDTO } from './dto/add-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { ProductPart } from 'src/model/product-part/product-part.schema';
import { OrderProduct } from 'src/model/order-product/order-product.schema';
import { generateRandomCode, paginator, toJsObject } from 'src/shared/helper';
import { classToPlain } from 'class-transformer';
import { ProductsResponse } from './response/products-response';
import { ProductDetailResponse } from './response/product-detail-response';
import { ProductPartResponse } from './response/product-part-response';
import { ProductResponse } from './response/product-response';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private productModel: PaginateModel<Product>,
    @InjectModel('Part')
    private partModel: PaginateModel<Part>,
    @InjectModel('Product_Part')
    private productPartModel: Model<ProductPart>,
    @InjectModel('Task')
    private taskModel: Model<Task>,
    @InjectModel('Order')
    private orderModel: Model<Order>,
    @InjectModel('Order_Product')
    private orderProductModel: Model<OrderProduct>,
    @InjectModel('Product_WorkCenter')
    private productWCModel: Model<ProductWorkCenter>,
  ) {}

  async create(productDTO: AddProductDTO, originURL: string) {
    try {
      const resultSku = await this.productModel.findOne({
        sku: productDTO.sku,
      });
      if (resultSku) throw new ConflictException('sku is already exist');
      productDTO.files = await Promise.all(
        productDTO.files.map(
          async (img) => await getNewImgLink(img, 'product-file', originURL),
        ),
      );
      productDTO.images = await Promise.all(
        productDTO.images.map(
          async (img) => await getNewImgLink(img, 'product', originURL),
        ),
      );
      const codes = (await this.productModel.find()).map((e) => e.product_no);
      const product = await new this.productModel({
        product_no: generateRandomCode(codes),
        ...productDTO,
      }).save();
      return classToPlain(new ProductResponse(toJsObject(product)));
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
          { product_no: { $regex: searchRegex } },
          { sku: { $regex: searchRegex } },
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
        const products = await this.productModel.paginate(query, options);
        return classToPlain(new ProductsResponse(toJsObject(products)));
      } else {
        const products = await this.productModel
          .find(query)
          .sort({ created_at: SortQuery.Desc });
        return classToPlain(
          new ProductsResponse(
            toJsObject(paginator(products, 0, products.length)),
          ),
        );
      }
    } catch (error) {
      errorException(error);
    }
  }

  async getDetail(productId: string) {
    try {
      const product = await this.checkIsProductExist(productId);
      const parts = await this.productPartModel
        .find({
          product: productId,
        })
        .populate('part');
      product['parts'] = parts.map((e) => ({
        part: e.part,
        quantity: e.quantity,
      }));
      const orders = await this.orderProductModel
        .find({
          product: productId,
        })
        .populate('order');
      product['orders'] = orders;
      const tasks = await this.taskModel.find({ product: productId });
      product['tasks'] = tasks;
      return classToPlain(new ProductDetailResponse(toJsObject(product)));
    } catch (error) {
      errorException(error);
    }
  }

  async delete(productId: string) {
    try {
      const deletedProduct = await this.checkIsProductExist(productId);
      const relatedTasks = await this.taskModel.find({
        product: productId,
      });
      if (relatedTasks.length > 0) throwCanNotDeleteErr('Product', 'Task');
      const relatedOrders = await this.orderProductModel.find({
        product: productId,
      });
      if (relatedOrders.length > 0) throwCanNotDeleteErr('Product', 'Order');
      const relatedWorkCenters = await this.productWCModel.find({
        product: productId,
      });
      if (relatedWorkCenters.length > 0)
        throwCanNotDeleteErr('Product', 'WorkCenter');
      await this.productModel.findByIdAndDelete(productId);
      deletedProduct.images.forEach(async (img) => {
        await deleteImgPath(img);
      });
      deletedProduct.files.forEach(async (file) => {
        await deleteImgPath(file);
      });
      await this.productPartModel.deleteMany({ product: productId });
      await this.orderProductModel.deleteMany({ product: productId });
    } catch (error) {
      errorException(error);
    }
  }

  async update(
    productId: string,
    productDTO: UpdateProductDTO,
    originURL: string,
  ) {
    try {
      // Add Part to Product
      await this.checkIsProductExist(productId);
      if (Array.isArray(productDTO.parts)) {
        await this.productPartModel.deleteMany({ product: productId });
        const productParts = await this.productPartModel.insertMany(
          productDTO.parts.map((e) => ({
            product: productId,
            part: e.part,
            quantity: e.quantity,
          })),
        );
        return productParts.map((e) =>
          classToPlain(new ProductPartResponse(toJsObject(e))),
        );
      } else {
        const oldProduct = await this.checkIsProductExist(productId);
        productDTO.images = await Promise.all(
          productDTO.images.map(
            async (img) => await getNewImgLink(img, 'product', originURL),
          ),
        );
        productDTO.files = await Promise.all(
          productDTO.files.map(
            async (img) => await getNewImgLink(img, 'product-file', originURL),
          ),
        );
        oldProduct.images.forEach(async (img) => {
          await deleteImgPath(img);
        });
        oldProduct.files.forEach(async (img) => {
          await deleteImgPath(img);
        });
        const newProduct = await this.productModel
          .findByIdAndUpdate(productId, productDTO, { new: true })
          .lean();
        return classToPlain(new ProductResponse(toJsObject(newProduct)));
      }
    } catch (error) {
      errorException(error);
    }
  }

  async checkIsProductExist(productId: string) {
    try {
      const product = await this.productModel.findById(productId).lean();
      if (!product) throw new NotFoundException('Product is not exist');
      return product;
    } catch (error) {
      errorException(error);
    }
  }
}
