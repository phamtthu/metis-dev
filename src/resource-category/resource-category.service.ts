import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, PaginateModel } from "mongoose"
import { throwSrvErr } from "src/common/utils/error"
import { deleteImgPath, getNewImgLink } from "src/common/utils/image-handler"
import { Resource } from "src/model/resource.shema"
import { ResourceCategory } from "src/model/resourcecategory.schema"
import { AddRCategoryDTO } from "./dto/add-rcategory.dto"
import { UpdateRCategoryRDTO } from "./dto/update-rcategory.dto"
@Injectable()
export class ResourceCategoryService {

    constructor(
        @InjectModel('ResourceCategory') private rCategoryModel: Model<ResourceCategory>,
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

    async getList(search: string) {
        if (search) {
            const searchRegex = new RegExp(search, 'i')
            return await this.rCategoryModel.find({
                $or: [
                    { name: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } }
                ]
            })
        }
        else
            return await this.getNestedList()
    }

    async getNestedList(rCategoryId = null) {
        let allRCategories = await this.rCategoryModel
            .find()
            .lean()
        const nest = (items, _id = rCategoryId, link = 'parent') => items
            .filter(item => item[link]?.toString() === _id?.toString())
            .map(item => ({ ...item, children: nest(items, item._id) }))
        return nest(allRCategories)
    }

    async getDetail(rCategoryId: string) {
        try {
            const theCategory = await this.rCategoryModel.findById(rCategoryId).lean()
            let rootAndsubCategories = await this.getAllSubCategoriesFromRootCategory(rCategoryId)
            rootAndsubCategories = rootAndsubCategories.map((e) => e._id)
            theCategory['sub_categoriesID'] = rootAndsubCategories
            theCategory['children'] = await this.getNestedList(rCategoryId)
            return theCategory
        } catch (e) { throw new Error(e.message) }
    }

    async getAllSubCategoriesFromRootCategory(rCategoryId: string) {
        const theCategory = await this.rCategoryModel
            .findById(rCategoryId)
            .lean()
        if (!theCategory)
            throw new NotFoundException('CATEGORY ID NOT FOUND')
        theCategory['children'] = await this.getNestedList(rCategoryId)
        // Flat Nested array and return Products[]
        const flatten = arr => arr.flatMap(({ children, ...o }) => [o, ...flatten(children)])
        return flatten([theCategory])
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