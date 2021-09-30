import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, PaginateModel } from "mongoose"
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto"
import { SortQuery } from "src/common/enum/filter.enum"
import { throwSrvErr } from "src/common/utils/error"
import { deleteImgPath, getNewImgLink } from "src/common/utils/image-handler"
import { Resource } from "src/model/resource.shema"
import { ResourceCategory } from "src/model/resource-category.schema"
import { getNestedList, paginator } from "src/shared/helper"
import { AddRCategoryDTO } from "./dto/add-rcategory.dto"
import { UpdateRCategoryRDTO } from "./dto/update-rcategory.dto"

@Injectable()
export class ResourceCategoryService {

    constructor(
        @InjectModel('Resource_Category') private rCategoryModel: PaginateModel<ResourceCategory>,
        @InjectModel('Resource') private resourceModel: Model<Resource>
    ) { }

    async create(rCategoryDTO: AddRCategoryDTO, originURL: string) {
        try {
            rCategoryDTO.image = await getNewImgLink(
                rCategoryDTO.image,
                'resource-category',
                originURL)
            return await (new this.rCategoryModel(rCategoryDTO)).save()
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
                    return await this.rCategoryModel.paginate(query, paginationOptions)
                } else {
                    return await this.rCategoryModel.find(query)
                        .sort({ 'created_at': SortQuery.Desc })
                }
            } else {
                const categories = await this.rCategoryModel.find()
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

    async getDetail(rCategoryId: string) {
        try {
            const theCategory: any = await this.rCategoryModel.findById(rCategoryId).lean()
            const categories: any = await this.rCategoryModel.find()
                .sort({ 'created_at': SortQuery.Desc })
                .lean()
            let rootAndsubCategories = await this.getAllSubCategoriesFromRootCategory(theCategory, categories)
            theCategory['sub_categoriesID'] = rootAndsubCategories.map((e) => e._id)
            theCategory['children'] = getNestedList(rCategoryId, categories)
            return theCategory
        } catch (error) { throwSrvErr(error) }
    }

    async getAllSubCategoriesFromRootCategory(theCategory: ResourceCategory, categories: ResourceCategory[]) {
        try {
            theCategory['children'] = getNestedList(theCategory._id, categories)
            // Flat Nested array and return Products[]
            const flatten = arr => arr.flatMap(({ children, ...o }) => [o, ...flatten(children)])
            return flatten([theCategory])
        } catch (error) { throwSrvErr(error) }
    }

    async delete(rCategoryId: string) {
        const deletedRCategory = await this.rCategoryModel.findByIdAndDelete(rCategoryId)
        await this.resourceModel.updateMany({ category: rCategoryId }, { category: null })
        // Change parent_id of its Sub Category to null 
        await this.rCategoryModel.updateMany({ parent: rCategoryId }, { parent: null })
        if (deletedRCategory.image)
            await deleteImgPath(deletedRCategory.image)
        return deletedRCategory
    }

    async update(rCategoryId: string, rCategoryDTO: UpdateRCategoryRDTO, originURL: string) {
        rCategoryDTO.image = await getNewImgLink(
            rCategoryDTO.image,
            'resource-category',
            originURL)
        const beforeUpdate = await this.rCategoryModel.findByIdAndUpdate(
            rCategoryId,
            rCategoryDTO)
        // Delete old Image 
        await deleteImgPath(beforeUpdate.image)
        return await this.rCategoryModel.findById(rCategoryId)
    }

    async getResourceFromGivenPCategory(rCategoryId: string) {
        let { sub_categoriesID }: any = await this.getDetail(rCategoryId)
        sub_categoriesID = sub_categoriesID.map((e) => String(e))
        return await this.resourceModel.find({ category: { "$in": sub_categoriesID } })
    }

}