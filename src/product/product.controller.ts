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
import { Request as ERequest } from 'express';
import { Response as EResponse } from 'express';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ProductService } from './product.service';
import { AddProductDTO } from './dto/add-product.dto';
import { getOriginURL } from 'src/shared/helper';
import { ProductID } from 'src/shared/pipe/productId.pipe';
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
  async create(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Body() productDTO: AddProductDTO,
  ) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.productService.create(productDTO, originURL);
      return res.status(HttpStatus.CREATED).json({
        message: 'Create Product successfully',
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get()
  async getList(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Query('search') search: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    try {
      const result = await this.productService.getList(
        { offset, limit },
        search?.trim(),
      );
      return res.status(HttpStatus.OK).json({
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get('/:productId')
  async getDetail(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Param('productId', ProductID) productId: string,
  ) {
    try {
      const result = await this.productService.getDetail(productId);
      return res.status(HttpStatus.OK).json({
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Delete('/:productId')
  async delete(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Param('productId', ProductID) productId: string,
  ) {
    try {
      await this.productService.delete(productId);
      return res.status(HttpStatus.OK).json({
        message: 'Delete Product successfully',
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Put('/:productId')
  async update(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Body() productDTO: UpdateProductDTO,
    @Param('productId', ProductID) productId: string,
  ) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.productService.update(
        productId,
        productDTO,
        originURL,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Update Product successfully',
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }
}
