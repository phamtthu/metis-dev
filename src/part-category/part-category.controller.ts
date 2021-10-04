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
import { AddPCategoryDTO } from './dto/add-part-category.dto';
import { PartCategoryService } from './part-category.service';
import { getOriginURL } from 'src/shared/helper';
import { UpdatePCategoryRDTO } from './dto/update-part-category.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('api/part-category')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
export class PartCategoryController {
  constructor(private partCategoryService: PartCategoryService) {}

  @Post()
  async create(@Request() req, @Body() pCategoryDTO: AddPCategoryDTO) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.partCategoryService.create(
        pCategoryDTO,
        originURL,
      );
      return {
        message: 'Create Part Category successfully',
        data: result,
      };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get()
  async getList(@Request() req, @Query() queryDto: PaginationQueryDto) {
    try {
      const result = await this.partCategoryService.getList(queryDto);
      return { data: result };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get('/:categoryId')
  async getDetail(@Request() req, @Param('categoryId') categoryId: string) {
    try {
      const result = await this.partCategoryService.getDetail(categoryId);
      return { data: result };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Delete('/:categoryId')
  async delete(@Request() req, @Param('categoryId') categoryId: string) {
    try {
      await this.partCategoryService.delete(categoryId);
      return {
        message: 'Delete Part Category successfully',
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
      const result = await this.partCategoryService.update(
        categoryId,
        pCategoryDTO,
        originURL,
      );
      return {
        message: 'Update Part Category successfully',
        data: result,
      };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get('part/:categoryId')
  async getPartFromGivenPartCategory(
    @Request() req,
    @Param('categoryId') categoryId: string,
  ) {
    try {
      const result =
        await this.partCategoryService.getPartFromGivenPartCategory(categoryId);
      return { data: result };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }
}
