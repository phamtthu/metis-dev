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
import { AddPCategoryDTO } from './dto/add-pcategory.dto';
import { ProductCategoryService } from './product-category.service';
import { getOriginURL } from 'src/shared/helper';
import { UpdatePCategoryRDTO } from './dto/update-pcategory.dto';
import { ProductCategoryID } from 'src/shared/pipe/productcategoryId.pipe';

@Controller('api/product-category')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
export class ProductCategoryController {
  constructor(private pcategoryService: ProductCategoryService) {}

  @Post()
  async create(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Body() pCategoryDTO: AddPCategoryDTO,
  ) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.pcategoryService.create(
        pCategoryDTO,
        originURL,
      );
      return res.status(HttpStatus.CREATED).json({
        message: 'Create Product Category successfully',
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
      const result = await this.pcategoryService.getList(
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

  @Get('/:categoryId')
  async getDetail(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Param('categoryId', ProductCategoryID) categoryId: string,
  ) {
    try {
      const result = await this.pcategoryService.getDetail(categoryId);
      return res.status(HttpStatus.OK).json({
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Delete('/:categoryId')
  async delete(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Param('categoryId', ProductCategoryID) categoryId: string,
  ) {
    try {
      await this.pcategoryService.delete(categoryId);
      return res.status(HttpStatus.OK).json({
        message: 'Delete Product Category successfully',
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Put('/:categoryId')
  async update(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Body() pCategoryDTO: UpdatePCategoryRDTO,
    @Param('categoryId', ProductCategoryID) categoryId: string,
  ) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.pcategoryService.update(
        categoryId,
        pCategoryDTO,
        originURL,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Update Product Category successfully',
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get('product/:categoryId')
  async getProductFromGivenPCategory(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Param('categoryId', ProductCategoryID) categoryId: string,
  ) {
    try {
      const result = await this.pcategoryService.getProductFromGivenPCategory(
        categoryId,
      );
      return res.status(HttpStatus.OK).json({
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }
}
