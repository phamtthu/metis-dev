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
import { SequenceService } from './sequence.service'
import { AddSequenceDTO } from './dto/add-sequence.dto'
import { SequenceID } from 'src/shared/pipe/sequenceId.pipe'
import { UpdateSequenceDTO } from './dto/update-sequence.dto'

@Controller('api/sequence')
@UsePipes(new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true
}))
export class SequenceController {

    constructor(
        private sequenceService: SequenceService
    ) { }

    @Post()
    async create(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Body() sequenceDTO: AddSequenceDTO
    ) {
        try {
            const result = await this.sequenceService
                .create(sequenceDTO)
            return res.status(HttpStatus.CREATED).json({
                message: 'Create Sequence successfully',
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
            const result = await this.sequenceService
                .getList({ offset, limit }, search?.trim())
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Get('/:sequenceId')
    async getDetail(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Param('sequenceId', SequenceID) sequenceId: string
    ) {
        try {
            const result = await this.sequenceService.getDetail(sequenceId)
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Delete('/:sequenceId')
    async delete(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Param('sequenceId', SequenceID) sequenceId: string
    ) {
        try {
            await this.sequenceService.delete(sequenceId)
            return res.status(HttpStatus.OK).json({
                message: 'Delete Sequence successfully'
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Put('/:sequenceId')
    async update(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Body() sequenceDTO: UpdateSequenceDTO,
        @Param('sequenceId', SequenceID) sequenceId: string
    ) {
        try {
            const result = await this.sequenceService.update(
                sequenceId, sequenceDTO)
            return res.status(HttpStatus.OK).json({
                message: 'Update Sequence successfully',
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

}
