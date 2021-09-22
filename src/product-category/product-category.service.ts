import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, PaginateModel } from "mongoose"
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto"
import { SortQuery } from "src/common/enum/filter.enum"
import { throwSrvErr } from "src/common/utils/error"
import { deleteImgPath, getNewImgLink } from "src/common/utils/image-handler"
import { ProductCategory } from "src/model/productcategory.schema"
import { Product } from "src/order/dto/add-order.dto"
import { getNestedList, paginator } from "src/shared/helper"
import { AddPCategoryDTO } from "./dto/add-pcategory.dto"
import { UpdatePCategoryRDTO } from "./dto/update-pcategory.dto"

@Injectable()
export class ProductCategoryService {

    constructor(
        @InjectModel('ProductCategory') private pCategoryModel: PaginateModel<ProductCategory>,
        @InjectModel('Product') private productModel: Model<Product>
    ) { }

    async create(pCategoryDTO: AddPCategoryDTO, originURL: string) {
        try {
            pCategoryDTO.image = await getNewImgLink(
                pCategoryDTO.image,
                'product-category',
                originURL)
            return await (new this.pCategoryModel(pCategoryDTO)).save()
        } catch (error) { throwSrvErr(error) }
    }

    async getList(paginateQuery: PaginationQueryDto, search: string) {
        try {
            const searchRegex = new RegExp(search, 'i')
            const query = {
                $or: [
                    { name: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } }
                ]
            }
            if (search) {
                const paginationOptions = {
                    offset: paginateQuery.offset,
                    limit: paginateQuery.limit,
                    sort: { created_at: SortQuery.Desc },
                    customLabels: {
                        page: 'page',
                        limit: 'per_page',
                        totalDocs: 'total',
                        totalPages: 'total_pages',
                        docs: 'data'
                    }
                }
                if (paginateQuery.offset >= 0 && paginateQuery.limit >= 0) {
                    return await this.pCategoryModel.paginate(query, paginationOptions)
                } else {
                    return await this.pCategoryModel.find(query)
                        .sort({ 'created_at': SortQuery.Desc })
                }
            } else {
                const categories = await this.pCategoryModel.find()
                    .sort({ 'created_at': SortQuery.Desc })
                    .lean()
                const nestedCategories = getNestedList(null, categories)
                if (paginateQuery.offset >= 0 && paginateQuery.limit >= 0) {
                    return paginator(
                        nestedCategories,
                        paginateQuery.offset,
                        paginateQuery.limit)
                } else {
                    return nestedCategories
                }
            }
        } catch (error) { throwSrvErr(error) }
    }

    async getDetail(pCategoryId: string) {
        try {
            const theCategory: any = await this.pCategoryModel.findById(pCategoryId).lean()
            const categories: any = await this.pCategoryModel.find()
                .sort({ 'created_at': SortQuery.Desc })
                .lean()
            let rootAndsubCategories = await this.getAllSubCategoriesFromRootCategory(theCategory, categories)
            theCategory['sub_categoriesID'] = rootAndsubCategories.map((e) => e._id)
            theCategory['children'] = getNestedList(pCategoryId, categories)
            return theCategory
        } catch (error) { throwSrvErr(error) }
    }

    async getAllSubCategoriesFromRootCategory(theCategory: ProductCategory, categories: ProductCategory[]) {
        try {
            theCategory['children'] = getNestedList(theCategory._id, categories)
            // Flat Nested array and return Products[]
            const flatten = arr => arr.flatMap(({ children, ...o }) => [o, ...flatten(children)])
            return flatten([theCategory])
        } catch (error) { throwSrvErr(error) }
    }

    async delete(pCategoryId: string) {
        try {
            const deletedRCategory = await this.pCategoryModel.findByIdAndDelete(pCategoryId)
            await this.productModel.updateMany({ category: pCategoryId }, { category: null })
            // Change parent_id of its Sub Category to null 
            await this.pCategoryModel.updateMany({ parent: pCategoryId }, { parent: null })
            if (deletedRCategory.image)
                await deleteImgPath(deletedRCategory.image)
            return deletedRCategory
        } catch (error) { throwSrvErr(error) }
    }

    async update(pCategoryId: string, pCategoryDTO: UpdatePCategoryRDTO, originURL: string) {
        try {
            pCategoryDTO.image = await getNewImgLink(
                pCategoryDTO.image,
                'product-category',
                originURL)
            const beforeUpdate = await this.pCategoryModel.findByIdAndUpdate(
                pCategoryId,
                pCategoryDTO)
            // Delete old Image 
            await deleteImgPath(beforeUpdate.image)
            return await this.pCategoryModel.findById(pCategoryId)
        } catch (error) { throwSrvErr(error) }
    }

    async getProductFromGivenPCategory(pCategoryId: string) {
        try {
            let { sub_categoriesID }: any = await this.getDetail(pCategoryId)
            sub_categoriesID = sub_categoriesID.map((e) => String(e))
            return await this.productModel.find({ category: { "$in": sub_categoriesID } })
        } catch (error) { throwSrvErr(error) }
    }

}