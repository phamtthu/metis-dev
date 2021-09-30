import {
    Body,
    Delete,
    HttpStatus,
    NotFoundException,
    Post,
    Put,
    Query,
    Request,
    Response,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'
import { Controller, Get, Param } from '@nestjs/common'
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto'
import { throwCntrllrErr } from 'src/common/utils/error'
import { AddResourceDTO } from './dto/add-resource.dto'
import { UpdateResourceDTO } from './dto/update-resource.dto'
import { ResourceService } from './resource.service'
import { Request as ERequest } from 'express'
import { Response as EResponse } from 'express'
import { getOriginURL } from 'src/shared/helper'
import { ResourceID } from 'src/shared/pipe/resourceId.pipe'

@Controller('api/resource')
@UsePipes(new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true
}))
export class ResourceController {

    constructor(
        private resoureService: ResourceService
    ) { }

    @Post()
    async create(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Body() resourceDTO: AddResourceDTO
    ) {
        try {
            const originURL = getOriginURL(req)
            const result = await this.resoureService.create(resourceDTO, originURL)
            return res.status(HttpStatus.CREATED).json({
                message: 'Create Resource successfully',
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Get()
    async getList(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Query('search') search: string,
        @Query('offset') offset: number,
        @Query('limit') limit: number
    ) {
        try {
            const result = await this.resoureService.getList({ offset, limit }, search?.trim())
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Get('/:resourceId')
    async getDetail(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Param('resourceId', ResourceID) resourceId: string
    ) {
        try {
            const result = await this.resoureService.getDetail(resourceId)
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Delete('/:resourceId')
    async delete(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Param('resourceId', ResourceID) resourceId: string
    ) {
        try {
            await this.resoureService.delete(resourceId)
            return res.status(HttpStatus.OK).json({
                message: 'Delete Resource successfully'
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    //  Add User to Resource
    @Put('/:resourceId')
    async update(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Body() resourceDTO: UpdateResourceDTO,
        @Param('resourceId', ResourceID) resourceId: string,

    ) {
        try {
            const originURL = getOriginURL(req)
            const result = await this.resoureService.update(
                resourceId, resourceDTO, originURL)
            return res.status(HttpStatus.OK).json({
                message: 'Update Resource successfully',
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

}
