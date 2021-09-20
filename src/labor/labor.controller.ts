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
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto'
import { throwCntrllrErr } from 'src/common/utils/error'
import { AddLaborDTO } from './dto/add-labor.dto'
import { UpdateLaborDTO } from './dto/update-labor'
import { LaborService } from './labor.service'
import { Request as ERequest } from 'express'
import { Response as EResponse } from 'express'
import { getOriginURL } from 'src/shared/helper'
import { LaborID } from 'src/shared/pipe/laborId.pipe'

@Controller('api/labor')
@UsePipes(new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true
}))
export class LaborController {

    constructor(
        private laborService: LaborService
    ) { }

    @Post()
    async create(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Body() laborDTO: AddLaborDTO
    ) {
        try {
            const originURL = getOriginURL(req)
            const result = await this.laborService.create(laborDTO, originURL)
            return res.status(HttpStatus.CREATED).json({
                message: 'Create Labor successfully',
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
            const result = await this.laborService.getList({ offset, limit }, search?.trim())
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Get('/:laborId')
    async getDetail(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Param('laborId', LaborID) laborId: string
    ) {
        try {
            const result = await this.laborService.getDetail(laborId)
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Delete('/:laborId')
    async delete(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Param('laborId', LaborID) laborId: string
    ) {
        try {
            await this.laborService.delete(laborId)
            return res.status(HttpStatus.OK).json({
                message: 'Delete Labor successfully'
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Put('/:laborId')
    async update(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Param('laborId', LaborID) laborId: string,
        @Body() laborDTO: UpdateLaborDTO
    ) {
        try {
            const originURL = getOriginURL(req)
            const result = await this.laborService.update(
                laborId, laborDTO, originURL)
            return res.status(HttpStatus.OK).json({
                message: 'Update Labor successfully',
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }


}
