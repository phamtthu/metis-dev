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
import { ProcessService } from './process.service'
import { AddProcessDTO } from './dto/add-process.dto'
import { ProcessID } from 'src/shared/pipe/processId.pipe'
import { UpdateProcessDTO } from './dto/update-process.dto'

@Controller('api/process')
@UsePipes(new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true
}))
export class ProcessController {

    constructor(
        private processService: ProcessService
    ) { }

    @Post()
    async create(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Body() processDTO: AddProcessDTO
    ) {
        try {
            const result = await this.processService
                .create(processDTO)
            return res.status(HttpStatus.CREATED).json({
                message: 'Create Process successfully',
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
            const result = await this.processService
                .getList({ offset, limit }, search?.trim())
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Get('/:processId')
    async getDetail(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Param('processId', ProcessID) processId: string
    ) {
        try {
            const result = await this.processService.getDetail(processId)
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Delete('/:processId')
    async delete(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Param('processId', ProcessID) processId: string
    ) {
        try {
            await this.processService.delete(processId)
            return res.status(HttpStatus.OK).json({
                message: 'Delete Process successfully'
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Put('/:processId')
    async update(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Body() processDTO: UpdateProcessDTO,
        @Param('processId', ProcessID) processId: string
    ) {
        try {
            const result = await this.processService.update(
                processId, processDTO)
            return res.status(HttpStatus.OK).json({
                message: 'Update Process successfully',
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

}
