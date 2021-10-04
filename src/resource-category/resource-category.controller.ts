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
import { AddRCategoryDTO } from './dto/add-resource-category.dto';
import { ResourceCategoryService } from './resource-category.service';
import { getOriginURL } from 'src/shared/helper';
import { UpdateRCategoryRDTO } from './dto/update-resource-category.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('api/resource-category')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
export class ResourceCategoryController {
  constructor(private rcategoryService: ResourceCategoryService) {}

  @Post()
  async create(@Request() req, @Body() rCategoryDTO: AddRCategoryDTO) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.rcategoryService.create(
        rCategoryDTO,
        originURL,
      );
      return {
        message: 'Create Resouce Category successfully',
        data: result,
      };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get()
  async getList(@Request() req, @Query() queryDto: PaginationQueryDto) {
    try {
      const result = await this.rcategoryService.getList(queryDto);
      return { data: result };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get('/:categoryId')
  async getDetail(@Request() req, @Param('categoryId') categoryId: string) {
    try {
      const result = await this.rcategoryService.getDetail(categoryId);
      return { data: result };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Delete('/:categoryId')
  async delete(@Request() req, @Param('categoryId') categoryId: string) {
    try {
      await this.rcategoryService.delete(categoryId);
      return { message: 'Delete Resource Category successfully' };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Put('/:categoryId')
  async update(
    @Request() req,
    @Body() rCategoryDTO: UpdateRCategoryRDTO,
    @Param('categoryId') categoryId: string,
  ) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.rcategoryService.update(
        categoryId,
        rCategoryDTO,
        originURL,
      );
      return {
        message: 'Update Resource Category successfully',
        data: result,
      };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  // Get all Resource From this Category
  @Get('resource/:categoryId')
  async getProductFromGivenPCategory(
    @Request() req,
    @Param('categoryId') categoryId: string,
  ) {
    try {
      const result = await this.rcategoryService.getResourceFromGivenPCategory(
        categoryId,
      );
      return { data: result };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }
}
