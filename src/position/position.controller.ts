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
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto'
import { PositionService } from './position.service'
import { AddPositionDTO } from './dto/add-position.dto'
import { UpdatePositionDTO } from './dto/update-position.dto'
import { PositionID } from 'src/shared/pipe/positionId.pipe'

@Controller('api/position')
@UsePipes(new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true
}))
export class PositionController {

    constructor(
        private positionService: PositionService
    ) { }

    @Post()
    async create(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Body() positionDTO: AddPositionDTO
    ) {
        try {
            const result = await this.positionService.create(positionDTO)
            return res.status(HttpStatus.CREATED).json({
                message: 'Create Position successfully',
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
            const result = await this.positionService.getList({ offset, limit }, search?.trim())
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Get('user/:positionId')
    async getUsersWithGivenPosition(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Param('positionId', PositionID) positionId: string,
        @Query() paginateQuery: PaginationQueryDto
    ) {
        try {
            const result = await this.positionService.getUsersWithGivenPosition(
                positionId, paginateQuery)
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Get('/:positionId')
    async getDetail(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Param('positionId', PositionID) positionId: string
    ) {
        try {
            const result = await this.positionService.getDetail(positionId)
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Delete('/:positionId')
    async delete(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Param('positionId', PositionID) positionId: string
    ) {
        try {
            await this.positionService.delete(positionId)
            return res.status(HttpStatus.OK).json({
                message: 'Delete Position successfully'
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Put('/:positionId')
    async update(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Body() positionDTO: UpdatePositionDTO,
        @Param('positionId', PositionID) positionId: string
    ) {
        try {
            const result = await this.positionService.update(
                positionId, positionDTO)
            return res.status(HttpStatus.OK).json({
                message: 'Update Position successfully',
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

}
