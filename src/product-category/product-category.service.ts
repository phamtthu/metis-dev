import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, PaginateModel } from "mongoose"
import { throwSrvErr } from "src/common/utils/error"
import { deleteImgPath, getNewImgLink } from "src/common/utils/image-handler"
import { ProductCategory } from "src/model/productcategory.schema"
import { Product } from "src/order/dto/add-order.dto"
import { AddPCategoryDTO } from "./dto/add-pcategory.dto"
import { UpdatePCategoryRDTO } from "./dto/update-pcategory.dto"
@Injectable()
export class ProductCategoryService {

    constructor(
        @InjectModel('ProductCategory') private pCategoryModel: Model<ProductCategory>,
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

    async getList(search: string) {
        if (search) {
            const searchRegex = new RegExp(search, 'i')
            return await this.pCategoryModel.find({
                $or: [
                    { name: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } }
                ]
            })
        }
        else
            return await this.getNestedList()
    }

    async getNestedList(pCategoryId = null) {
        let allRCategories = await this.pCategoryModel
            .find()
            .lean()
        const nest = (items, _id = pCategoryId, link = 'parent') => items
            .filter(item => item[link]?.toString() === _id?.toString())
            .map(item => ({ ...item, children: nest(items, item._id) }))
        return nest(allRCategories)
    }

    async getDetail(pCategoryId: string) {
        try {
            const theCategory = await this.pCategoryModel.findById(pCategoryId).lean()
            let rootAndsubCategories = await this.getAllSubCategoriesFromRootCategory(pCategoryId)
            rootAndsubCategories = rootAndsubCategories.map((e) => e._id)
            theCategory['sub_categoriesID'] = rootAndsubCategories
            theCategory['children'] = await this.getNestedList(pCategoryId)
            return theCategory
        } catch (e) { throw new Error(e.message) }
    }

    async getAllSubCategoriesFromRootCategory(pCategoryId: string) {
        const theCategory = await this.pCategoryModel
            .findById(pCategoryId)
            .lean()
        if (!theCategory)
            throw new NotFoundException('CATEGORY ID NOT FOUND')
        theCategory['children'] = await this.getNestedList(pCategoryId)
        // Flat Nested array and return Products[]
        const flatten = arr => arr.flatMap(({ children, ...o }) => [o, ...flatten(children)])
        return flatten([theCategory])
    }

    async delete(pCategoryId: string) {
        const deletedRCategory = await this.pCategoryModel.findByIdAndDelete(pCategoryId)
        await this.productModel.updateMany({ category: pCategoryId }, { category: null })
        // Change parent_id of its Sub Category to null 
        await this.pCategoryModel.updateMany({ parent: pCategoryId }, { parent: null })
        if (deletedRCategory.image)
            await deleteImgPath(deletedRCategory.image)
        return deletedRCategory
    }

    async update(pCategoryId: string, pCategoryDTO: UpdatePCategoryRDTO, originURL: string) {
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
    }

    async getProductFromGivenPCategory(pCategoryId: string) {
        let { sub_categoriesID }: any = await this.getDetail(pCategoryId)
        sub_categoriesID = sub_categoriesID.map((e) => String(e))
        return await this.productModel.find({ category: { "$in": sub_categoriesID } })
    }

}