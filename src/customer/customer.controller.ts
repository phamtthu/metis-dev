import {
  Body,
  Delete,
  Post,
  Put,
  Query,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { messageError } from 'src/common/utils/error';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CustomerService } from './customer.service';
import { AddCustomerDTO } from './dto/add-customer.dto';
import { UpdateCustomerDTO } from './dto/update-customer.dto';

@Controller('api/customer')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post()
  async create(@Request() req, @Body() customerDTO: AddCustomerDTO) {
    try {
      const result = await this.customerService.create(customerDTO);
      return {
        message: 'Create Customer successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Get()
  async getList(@Request() req, @Query() queryDto: PaginationQueryDto) {
    try {
      const result = await this.customerService.getList(queryDto);
      return result;
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/:customerId')
  async getDetail(@Request() req, @Param('customerId') customerId: string) {
    try {
      const result = await this.customerService.getDetail(customerId);
      return { data: result };
    } catch (error) {
      messageError(error);
    }
  }

  @Delete('/:customerId')
  async delete(@Request() req, @Param('customerId') customerId: string) {
    try {
      await this.customerService.delete(customerId);
      return {
        message: 'Delete Customer successfully',
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Put('/:customerId')
  async update(
    @Request() req,
    @Body() customerDTO: UpdateCustomerDTO,
    @Param('customerId') customerId: string,
  ) {
    try {
      const result = await this.customerService.update(customerId, customerDTO);
      return {
        message: 'Update Customer successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }
}
