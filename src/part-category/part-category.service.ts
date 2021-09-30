import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, PaginateModel } from "mongoose"
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto"
import { SortQuery } from "src/common/enum/filter.enum"
import { throwSrvErr } from "src/common/utils/error"
import { deleteImgPath, getNewImgLink } from "src/common/utils/image-handler"
import { PartCategory } from "src/model/partcategory.schema"
import { ProductPart } from "src/model/productpart.schema"
import { getNestedList, paginator } from "src/shared/helper"
import { AddPCategoryDTO } from "./dto/add-part-category.dto"
import { UpdatePCategoryRDTO } from "./dto/update-part-category.dto"

@Injectable()
export class PartCategoryService {

    constructor(
        @InjectModel('Part_Category') private partCategoryModel: PaginateModel<PartCategory>,
        @InjectModel('Product_Part') private productPartModel: Model<ProductPart>
    ) { }

    async create(pCategoryDTO: AddPCategoryDTO, originURL: string) {
        try {
            pCategoryDTO.image = await getNewImgLink(
                pCategoryDTO.image,
                'product-category',
                originURL)
            return await (new this.partCategoryModel(pCategoryDTO)).save()
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
                    return await this.partCategoryModel.paginate(query, paginationOptions)
                } else {
                    return await this.partCategoryModel.find(query)
                        .sort({ 'created_at': SortQuery.Desc })
                }
            } else {
                const categories = await this.partCategoryModel.find()
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

    async getDetail(categoryId: string) {
        try {
            const theCategory: any = await this.partCategoryModel.findById(categoryId).lean()
            const categories: any = await this.partCategoryModel.find()
                .sort({ 'created_at': SortQuery.Desc })
                .lean()
            let rootAndsubCategories = await this.getAllSubCategoriesFromRootCategory(theCategory, categories)
            theCategory['sub_categoriesID'] = rootAndsubCategories.map((e) => e._id)
            theCategory['children'] = getNestedList(categoryId, categories)
            return theCategory
        } catch (error) { throwSrvErr(error) }
    }

    async getAllSubCategoriesFromRootCategory(theCategory: PartCategory, categories: PartCategory[]) {
        try {
            theCategory['children'] = getNestedList(theCategory._id, categories)
            // Flat Nested array and return Parts[]
            const flatten = arr => arr.flatMap(({ children, ...o }) => [o, ...flatten(children)])
            return flatten([theCategory])
        } catch (error) { throwSrvErr(error) }
    }

    async delete(categoryId: string) {
        try {
            const deletedRCategory = await this.partCategoryModel.findByIdAndDelete(categoryId)
            await this.productPartModel.updateMany({ category: categoryId }, { category: null })
            // Change parent_id of its Sub Category to null 
            await this.partCategoryModel.updateMany({ parent: categoryId }, { parent: null })
            if (deletedRCategory.image)
                await deleteImgPath(deletedRCategory.image)
            return deletedRCategory
        } catch (error) { throwSrvErr(error) }
    }

    async update(categoryId: string, pCategoryDTO: UpdatePCategoryRDTO, originURL: string) {
        try {
            pCategoryDTO.image = await getNewImgLink(
                pCategoryDTO.image,
                'product-category',
                originURL)
            const beforeUpdate = await this.partCategoryModel.findByIdAndUpdate(
                categoryId,
                pCategoryDTO)
            // Delete old Image 
            await deleteImgPath(beforeUpdate.image)
            return await this.partCategoryModel.findById(categoryId)
        } catch (error) { throwSrvErr(error) }
    }

    async getProductPartFromGivenPartCategory(categoryId: string) {
        try {
            let { sub_categoriesID }: any = await this.getDetail(categoryId)
            sub_categoriesID = sub_categoriesID.map((e) => String(e))
            return await this.productPartModel.find({ category: { "$in": sub_categoriesID } })
        } catch (error) { throwSrvErr(error) }
    }

}