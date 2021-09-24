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
import { WorkCenterService } from './workcenter.service'
import { AddWorkCenterDTO } from './dto/add-workcenter.dto'
import { WorkCenterID } from 'src/shared/pipe/workcenterId.pipe'
import { UpdateWorkCenterDTO } from './dto/update-workcenter.dto'

@Controller('api/workcenter')
@UsePipes(new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true
}))
export class WorkCenterController {

    constructor(
        private workCenterService: WorkCenterService
    ) { }

    @Post()
    async create(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Body() workCenterDTO: AddWorkCenterDTO
    ) {
        try {
            const result = await this.workCenterService.create(workCenterDTO)
            return res.status(HttpStatus.CREATED).json({
                message: 'Create Work Center successfully',
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
            const result = await this.workCenterService.getList({ offset, limit }, search?.trim())
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Get('/:workCenterId')
    async getDetail(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Param('workCenterId', WorkCenterID) workCenterId: string
    ) {
        try {
            const result = await this.workCenterService.getDetail(workCenterId)
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Delete('/:workCenterId')
    async delete(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Param('workCenterId', WorkCenterID) workCenterId: string
    ) {
        try {
            await this.workCenterService.delete(workCenterId)
            return res.status(HttpStatus.OK).json({
                message: 'Delete Work Center successfully'
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Put('/:workCenterId')
    async update(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Body() workCenterDTO: UpdateWorkCenterDTO,
        @Param('workCenterId', WorkCenterID) workCenterId: string
    ) {
        try {
            const result = await this.workCenterService.update(
                workCenterId, workCenterDTO)
            return res.status(HttpStatus.OK).json({
                message: 'Update Work Center successfully',
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

}
