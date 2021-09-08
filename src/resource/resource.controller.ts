import {
    Body,
    Delete,
    HttpException,
    HttpStatus,
    NotFoundException,
    Post,
    Put,
    Query,
    Request,
    Response,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'
import { Controller, Get, Param } from '@nestjs/common'
import { Types } from 'mongoose'
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto'
import { throwError } from 'src/common/utils/error'
import { AddResourceDTO } from './dto/add-resource.dto'
import { UpdateResourceDTO } from './dto/update-resource.dto'
import { ParseMongodbIdPipe } from './pipe/parse-mongoId.pipe'
import { ResourceService } from './resource.service'

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
        @Body() resourceDTO: AddResourceDTO,
        @Response() res,
        @Request() req) {
        try {
            const result = await this.resoureService.create(resourceDTO)
            return res.status(HttpStatus.CREATED).json({
                message: 'Create Resource successfully',
                data: result
            })
        } catch (error) { throwError(error) }
    }

    @Get()
    async getList(
        @Query() paginateQuery: PaginationQueryDto,
        @Response() res,
        @Request() req,
    ) {
        try {
            const result = await this.resoureService.getList(paginateQuery)
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwError(error) }
    }

    @Get('/:resourceId')
    async getDetail(
        @Param('resourceId') resourceId: string,
        @Response() res,
        @Request() req,
    ) {
        try {
            const result = await this.resoureService.getDetail(resourceId)
            if (!result)
                throw new NotFoundException('Resource is not exist')
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwError(error) }
    }

    @Delete('/:resourceId')
    async delete(
        @Param('resourceId') resourceId: string,
        @Response() res,
        @Request() req,
    ) {
        try {
            const result = await this.resoureService.delete(resourceId)
            if (!result)
                throw new NotFoundException('Resource is not exist')
            return res.status(HttpStatus.OK).json({
                message: 'Delete Resource successfully'
            })
        } catch (error) { throwError(error) }
    }

    @Put('/:resourceId')
    async update(
        @Body() resourceDTO: UpdateResourceDTO,
        @Param('resourceId') resourceId: string,
        @Response() res,
        @Request() req,
    ) {
        try {
            const result = await this.resoureService.update(
                resourceId, resourceDTO)
            if (!result)
                throw new NotFoundException('Resource is not exist')
            return res.status(HttpStatus.OK).json({
                message: 'Update Resource successfully',
                data: result
            })
        } catch (error) { throwError(error) }
    }

}
