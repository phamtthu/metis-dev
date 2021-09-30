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
import { AddPCategoryDTO } from './dto/add-part-category.dto';
import { PartCategoryService } from './part-category.service';
import { getOriginURL } from 'src/shared/helper';
import { UpdatePCategoryRDTO } from './dto/update-part-category.dto';
import { PartCategoryID } from 'src/shared/pipe/partcategoryId.pipe';

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
  async create(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Body() pCategoryDTO: AddPCategoryDTO,
  ) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.partCategoryService.create(
        pCategoryDTO,
        originURL,
      );
      return res.status(HttpStatus.CREATED).json({
        message: 'Create Part Category successfully',
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
      const result = await this.partCategoryService.getList(
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
    @Param('categoryId', PartCategoryID) categoryId: string,
  ) {
    try {
      const result = await this.partCategoryService.getDetail(categoryId);
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
    @Param('categoryId', PartCategoryID) categoryId: string,
  ) {
    try {
      await this.partCategoryService.delete(categoryId);
      return res.status(HttpStatus.OK).json({
        message: 'Delete Part Category successfully',
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
    @Param('categoryId', PartCategoryID) categoryId: string,
  ) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.partCategoryService.update(
        categoryId,
        pCategoryDTO,
        originURL,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Update Part Category successfully',
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get('part/:categoryId')
  async getProductPartFromGivenPartCategory(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Param('categoryId', PartCategoryID) categoryId: string,
  ) {
    try {
      const result =
        await this.partCategoryService.getProductPartFromGivenPartCategory(
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
