import {
    Body,
    Delete,
    HttpStatus,
    Post,
    Put,
    Query,
    Request,
    Response,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'
import { Controller, Get, Param } from '@nestjs/common'
import { throwCntrllrErr } from 'src/common/utils/error'
import { Request as ERequest } from 'express'
import { Response as EResponse } from 'express'
import { AddRCategoryDTO } from './dto/add-rcategory.dto'
import { ResourceCategoryService } from './resource-category.service'
import { ResourceCategoryID } from 'src/shared/pipe/resourcecategoryId.pipe'
import { getOriginURL } from 'src/shared/helper'
import { UpdateRCategoryRDTO } from './dto/update-rcategory.dto'

@Controller('api/resource-category')
@UsePipes(new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true
}))
export class ResourceCategoryController {

    constructor(
        private rcategoryService: ResourceCategoryService
    ) { }

    @Post()
    async create(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Body() rCategoryDTO: AddRCategoryDTO
    ) {
        try {
            const originURL = getOriginURL(req)
            const result = await this.rcategoryService.create(rCategoryDTO, originURL)
            return res.status(HttpStatus.CREATED).json({
                message: 'Create Resouce Category successfully',
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Get()
    async getList(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Query('offset') offset: number,
        @Query('limit') limit: number,
        @Query('search') search: string
    ) {
        try {
            const result = await this.rcategoryService.getList({ offset, limit }, search?.trim())
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Get('/:categoryId')
    async getDetail(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Param('categoryId', ResourceCategoryID) categoryId: string
    ) {
        try {
            const result = await this.rcategoryService.getDetail(categoryId)
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Delete('/:categoryId')
    async delete(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Param('categoryId', ResourceCategoryID) categoryId: string
    ) {
        try {
            await this.rcategoryService.delete(categoryId)
            return res.status(HttpStatus.OK).json({
                message: 'Delete Resource Category successfully'
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Put('/:categoryId')
    async update(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Body() rCategoryDTO: UpdateRCategoryRDTO,
        @Param('categoryId', ResourceCategoryID) categoryId: string
    ) {
        try {
            const originURL = getOriginURL(req)
            const result = await this.rcategoryService.update(
                categoryId, rCategoryDTO, originURL)
            return res.status(HttpStatus.OK).json({
                message: 'Update Resource Category successfully',
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    // Get all Resource From this Category
    @Get('resource/:categoryId')
    async getProductFromGivenPCategory(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Param('categoryId', ResourceCategoryID) categoryId: string
    ) {
        try {
            const result = await this.rcategoryService.getResourceFromGivenPCategory(categoryId)
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

}
