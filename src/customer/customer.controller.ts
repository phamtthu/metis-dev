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
import { CustomerService } from './customer.service'
import { AddCustomerDTO } from './dto/add-customer.dto'
import { CustomerID } from 'src/shared/pipe/customerId.pipe'
import { UpdateCustomerDTO } from './dto/update-customer.dto'

@Controller('api/customer')
@UsePipes(new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true
}))
export class CustomerController {

    constructor(
        private customerService: CustomerService
    ) { }

    @Post()
    async create(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Body() customerDTO: AddCustomerDTO
    ) {
        try {
            const result = await this.customerService
                .create(customerDTO)
            return res.status(HttpStatus.CREATED).json({
                message: 'Create Customer successfully',
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
            const result = await this.customerService
                .getList({ offset, limit }, search?.trim())
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Get('/:customerId')
    async getDetail(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Param('customerId', CustomerID) customerId: string
    ) {
        try {
            const result = await this.customerService.getDetail(customerId)
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Delete('/:customerId')
    async delete(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Param('customerId', CustomerID) customerId: string
    ) {
        try {
            await this.customerService.delete(customerId)
            return res.status(HttpStatus.OK).json({
                message: 'Delete Customer successfully'
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Put('/:customerId')
    async update(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Body() customerDTO: UpdateCustomerDTO,
        @Param('customerId', CustomerID) customerId: string
    ) {
        try {

            const result = await this.customerService.update(
                customerId, customerDTO)
            return res.status(HttpStatus.OK).json({
                message: 'Update Customer successfully',
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

}
