import {
  Body,
  Delete,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { messageError } from 'src/common/utils/error';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { OrderService } from './order.service';
import { AddOrderDTO } from './dto/add-order.dto';
import { UpdateOrderDTO } from './dto/update-product.dto';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role } from 'src/common/enum/filter.enum';

@Controller('api/order')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  async create(@Request() req, @Body() orderDTO: AddOrderDTO) {
    try {
      const result = await this.orderService.create(orderDTO);
      return {
        message: 'Create Order successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Get()
  async getList(@Request() req, @Query() queryDto: PaginationQueryDto) {
    try {
      const result = await this.orderService.getList(queryDto);
      return result;
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/:orderId')
  async getDetail(@Request() req, @Param('orderId') orderId: string) {
    try {
      const result = await this.orderService.getDetail(orderId);
      return { data: result };
    } catch (error) {
      messageError(error);
    }
  }

  @Delete('/:orderId')
  async delete(@Request() req, @Param('orderId') orderId: string) {
    try {
      await this.orderService.delete(orderId);
      return { message: 'Delete Order successfully' };
    } catch (error) {
      messageError(error);
    }
  }

  // Make Order (Customer, Product, Quantity)
  @Put('/:orderId')
  async update(
    @Request() req,
    @Body() orderDTO: UpdateOrderDTO,
    @Param('orderId') orderId: string,
  ) {
    try {
      const result = await this.orderService.update(orderId, orderDTO);
      return {
        message: 'Update Order successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }
}
