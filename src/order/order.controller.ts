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
import { OrderService } from './order.service'
import { AddOrderDTO } from './dto/add-order.dto'
import { OrderID } from 'src/shared/pipe/orderId.pipe'
import { UpdateOrderDTO } from './dto/update-product.dto'

@Controller('api/order')
@UsePipes(new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true
}))
export class OrderController {

    constructor(
        private orderService: OrderService
    ) { }

    @Post()
    async create(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Body() orderDTO: AddOrderDTO
    ) {
        try {
            const result = await this.orderService.create(
                orderDTO)
            return res.status(HttpStatus.CREATED).json({
                message: 'Create Order successfully',
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
            const result = await this.orderService.getList({ offset, limit }, search?.trim())
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Get('/:orderId')
    async getDetail(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Param('orderId', OrderID) orderId: string
    ) {
        try {
            const result = await this.orderService.getDetail(orderId)
            return res.status(HttpStatus.OK).json({
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Delete('/:orderId')
    async delete(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Param('orderId', OrderID) orderId: string
    ) {
        try {
            await this.orderService.delete(orderId)
            return res.status(HttpStatus.OK).json({
                message: 'Delete Order successfully'
            })
        } catch (error) { throwCntrllrErr(error) }
    }

    @Put('/:orderId')
    async update(
        @Request() req: ERequest,
        @Response() res: EResponse,
        @Body() orderDTO: UpdateOrderDTO,
        @Param('orderId', OrderID) orderId: string
    ) {
        try {
            const result = await this.orderService.update(
                orderId, orderDTO)
            return res.status(HttpStatus.OK).json({
                message: 'Update Order successfully',
                data: result
            })
        } catch (error) { throwCntrllrErr(error) }
    }

}
