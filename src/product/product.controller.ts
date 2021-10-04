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
  ValidationPipe,
} from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { throwCntrllrErr } from 'src/common/utils/error';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ProductService } from './product.service';
import { AddProductDTO } from './dto/add-product.dto';
import { getOriginURL } from 'src/shared/helper';
import { UpdateProductDTO } from './dto/update-product.dto';

@Controller('api/product')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  async create(@Request() req, @Body() productDTO: AddProductDTO) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.productService.create(productDTO, originURL);
      return {
        message: 'Create Product successfully',
        data: result,
      };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get()
  async getList(@Request() req, @Query() queryDto: PaginationQueryDto) {
    try {
      const result = await this.productService.getList(queryDto);
      return { data: result };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get('/:productId')
  async getDetail(@Request() req, @Param('productId') productId: string) {
    try {
      const result = await this.productService.getDetail(productId);
      return { data: result };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Delete('/:productId')
  async delete(@Request() req, @Param('productId') productId: string) {
    try {
      await this.productService.delete(productId);
      return {
        message: 'Delete Product successfully',
      };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Put('/:productId')
  async update(
    @Request() req,
    @Body() productDTO: UpdateProductDTO,
    @Param('productId') productId: string,
  ) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.productService.update(
        productId,
        productDTO,
        originURL,
      );
      return {
        message: 'Update Product successfully',
        data: result,
      };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }
}
