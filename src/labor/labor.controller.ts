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
import { throwError } from 'src/common/utils/error'
import { AddLaborDTO } from './dto/add-labor.dto'
import { UpdateLaborDTO } from './dto/update-labor'
import { LaborService } from './labor.service'

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
        @Body() laborDTO: AddLaborDTO,
        @Response() res,
        @Request() req) {
        try {
            const result = await this.laborService.create(laborDTO)
            return res.status(HttpStatus.CREATED).json({
                message: 'Create Labor successfully',
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
            const result = await this.laborService.getList(paginateQuery)
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwError(error) }
    }

    @Get('/:laborId')
    async getDetail(
        @Param('laborId') laborId: string,
        @Response() res,
        @Request() req,
    ) {
        try {
            const result = await this.laborService.getDetail(laborId)
            if (!result)
                throw new NotFoundException('Labor is not exist')
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwError(error) }
    }

    @Delete('/:laborId')
    async delete(
        @Param('laborId') laborId: string,
        @Response() res,
        @Request() req,
    ) {
        try {
            const result = await this.laborService.delete(laborId)
            if (!result)
                throw new NotFoundException('Labor is not exist')
            return res.status(HttpStatus.OK).json({
                message: 'Delete Labor successfully'
            })
        } catch (error) { throwError(error) }
    }

    @Put('/:laborId')
    async update(
        @Body() laborDTO: UpdateLaborDTO,
        @Param('laborId') laborId: string,
        @Response() res,
        @Request() req,
    ) {
        try {
            const result = await this.laborService.update(
                laborId, laborDTO)
            if (!result)
                throw new NotFoundException('Labor is not exist')
            return res.status(HttpStatus.OK).json({
                message: 'Update Labor successfully',
                data: result
            })
        } catch (error) { throwError(error) }
    }

}
