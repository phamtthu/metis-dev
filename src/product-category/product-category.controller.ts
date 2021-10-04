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
import { throwCntrllrErr } from 'src/common/utils/error';
import { AddPCategoryDTO } from './dto/add-product-category.dto';
import { ProductCategoryService } from './product-category.service';
import { getOriginURL } from 'src/shared/helper';
import { UpdatePCategoryRDTO } from './dto/update-product-category.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

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
  async create(@Request() req, @Body() pCategoryDTO: AddPCategoryDTO) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.pcategoryService.create(
        pCategoryDTO,
        originURL,
      );
      return {
        message: 'Create Product Category successfully',
        data: result,
      };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get()
  async getList(@Request() req, @Query() queryDto: PaginationQueryDto) {
    try {
      const result = await this.pcategoryService.getList(queryDto);
      return { data: result };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get('/:categoryId')
  async getDetail(@Request() req, @Param('categoryId') categoryId: string) {
    try {
      const result = await this.pcategoryService.getDetail(categoryId);
      return { data: result };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Delete('/:categoryId')
  async delete(@Request() req, @Param('categoryId') categoryId: string) {
    try {
      await this.pcategoryService.delete(categoryId);
      return {
        message: 'Delete Product Category successfully',
      };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Put('/:categoryId')
  async update(
    @Request() req,
    @Body() pCategoryDTO: UpdatePCategoryRDTO,
    @Param('categoryId') categoryId: string,
  ) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.pcategoryService.update(
        categoryId,
        pCategoryDTO,
        originURL,
      );
      return {
        message: 'Update Product Category successfully',
        data: result,
      };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get('product/:categoryId')
  async getProductFromGivenPCategory(
    @Request() req,
    @Param('categoryId') categoryId: string,
  ) {
    try {
      const result = await this.pcategoryService.getProductFromGivenPCategory(
        categoryId,
      );
      return { data: result };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }
}
