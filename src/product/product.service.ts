import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PaginateModel } from "mongoose";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";
import { SortQuery } from "src/common/enum/filter.enum";
import { throwSrvErr } from "src/common/utils/error";
import { deleteImgPath, getNewImgLink } from "src/common/utils/image-handler";
import { Order } from "src/model/order.schema";
import { Product } from "src/model/product.schema";
import { ProductPart } from "src/model/productpart.schema";
import { ProductWorkCenter } from "src/model/productworkcenter.schema";
import { Task } from "src/model/task.schema";
import { isTwoArrayEqual } from "src/shared/helper";
import { AddProductDTO } from "./dto/add-product.dto";
import { UpdateProductDTO } from "./dto/update-product.dto";

@Injectable()
export class ProductService {

    constructor(
        @InjectModel('Product') private productModel: PaginateModel<Product>,
        @InjectModel('Product_Part') private productPartModel: PaginateModel<ProductPart>,
        @InjectModel('Task') private taskModel: Model<Task>,
        @InjectModel('Order') private orderModel: Model<Order>,
        @InjectModel('Product_Work_Center') private productWCModel: Model<ProductWorkCenter>
    ) { }

    async create(productDTO: AddProductDTO, originURL: string) {
        try {
            const resultProduct_no = await this.productModel.findOne({ product_no: productDTO.product_no })
            if (resultProduct_no)
                throw new ConflictException('product_no is already exist')
            const resultSku = await this.productModel.findOne({ sku: productDTO.sku })

            if (resultSku)
                throw new ConflictException('sku is already exist')

            productDTO.files = await Promise.all(
                productDTO.files.map(async (img) =>
                    await getNewImgLink(img, 'product-file', originURL)))

            productDTO.images = await Promise.all(
                productDTO.images.map(async (img) =>
                    await getNewImgLink(img, 'product', originURL)))

            const product = await (new this.productModel(productDTO)).save()

            // Part
            await this.productPartModel.updateMany(
                { _id: { "$in": product.parts } },
                { $push: { products: product._id } })

            return product

        } catch (error) { throwSrvErr(error) }
    }

    async getList(paginateQuery: PaginationQueryDto, search: string) {
        try {
            const searchRegex = new RegExp(search, 'i')
            const query = {
                $or: [
                    { name: { $regex: searchRegex } },
                    { product_no: { $regex: searchRegex } },
                    { sku: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } }
                ]
            }
            const populateOption = [
                { path: 'parts', model: 'Product_Part', select: 'name' },
                { path: 'category', model: 'ProductCategory', select: 'name' },
                { path: 'tasks', model: 'Task', select: 'name' },
                { path: 'orders', model: 'Order', select: ['customer', 'po_no'] }
            ]
            if (paginateQuery.offset >= 0 && paginateQuery.limit >= 0) {
                const options = {
                    offset: paginateQuery.offset,
                    limit: paginateQuery.limit,
                    sort: { created_at: SortQuery.Desc },
                    populate: populateOption,
                    customLabels: {
                        page: 'page',
                        limit: 'per_page',
                        totalDocs: 'total',
                        totalPages: 'total_pages',
                        docs: 'data'
                    }
                }
                return await this.productModel.paginate(query, options)
            } else
                return await this.productModel.find(query)
                    .populate(populateOption)
                    .sort({ 'created_at': SortQuery.Desc })
        } catch (error) { throwSrvErr(error) }
    }

    async getDetail(productId: string) {
        try {
            const productDetail = await this.productModel.findById(productId)
                .populate(['tasks', 'orders', 'category']).lean()
            const { product, ...rest } = await this.productWCModel.findOne({ product: productId }).lean()
            return { productDetail, ...rest }
        } catch (error) { throwSrvErr(error) }
    }

    async delete(productId: string) {
        try {
            const deletedProduct = await this.productModel.findByIdAndDelete(productId)
            deletedProduct.images.forEach(async (img) => {
                await deleteImgPath(img)
            })
            // Tasks
            await this.taskModel.updateMany(
                { product: productId },
                { product: null })
            // Orders
            await this.orderModel.updateMany(
                { "products.product": productId },
                { "$pull": { "products": { "product": productId } } }
            )
            // Parts
            await this.productPartModel.updateMany(
                { _id: { "$in": deletedProduct.parts } },
                { $pull: { products: productId } })

            return deletedProduct
        } catch (error) { throwSrvErr(error) }
    }

    async update(productId: string, productDTO: UpdateProductDTO, originURL: string) {
        try {
            const oldProduct = await this.productModel.findById(productId).lean()
            const newProduct = await this.productModel.findByIdAndUpdate(
                productId, productDTO, { new: true }).lean()
            // Image
            productDTO.files = await Promise.all(
                productDTO.files.map(async (img) =>
                    await getNewImgLink(img, 'product-file', originURL)))
            productDTO.images = await Promise.all(
                productDTO.images.map(async (img) =>
                    await getNewImgLink(img, 'product', originURL)))

            oldProduct.images.forEach(async (img) => {
                await deleteImgPath(img)
            })
            oldProduct.files.forEach(async (img) => {
                await deleteImgPath(img)
            })
            // Part
            if (!isTwoArrayEqual(productDTO.parts, oldProduct.parts).map((e) => String(e))) {
                await this.productPartModel.updateMany(
                    { _id: { "$in": oldProduct.parts } },
                    { $pull: { products: productId } }
                )
                await this.productPartModel.updateMany(
                    { _id: { "$in": productDTO.parts } },
                    { $push: { products: productId } }
                )
            }
            let users = []
            let resources = []

            if (productDTO.users.length > 0) {
                const productWC = await this.productWCModel.findOneAndUpdate(
                    { product: productId },
                    { users: productDTO.users }
                ).lean()
                users = productWC.users
            }
            if (productDTO.resources.length > 0) {
                const productWC = await this.productWCModel.findOneAndUpdate(
                    { product: productId },
                    { resources: productDTO.resources }
                ).lean()
                resources = productWC.resources
            }
            newProduct['users'] = users
            newProduct['users'] = resources
            return newProduct

        } catch (error) { throwSrvErr(error) }
    }

}