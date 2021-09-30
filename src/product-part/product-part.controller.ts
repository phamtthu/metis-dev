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
import { ProductPartID } from '../../src/shared/pipe/productpartId.pipe';
import { ProductPartService } from './product-part.service';
import { AddProductPartDTO } from './dto/add-product-part.dto';
import { UpdateProductPartDTO } from './dto/update-product-part.dto';

@Controller('api/part')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
export class ProductPartController {
  constructor(private productPartService: ProductPartService) {}

  @Post()
  async create(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Body() productPartDTO: AddProductPartDTO,
  ) {
    try {
      const result = await this.productPartService.create(productPartDTO);
      return res.status(HttpStatus.CREATED).json({
        message: 'Create ProductPart successfully',
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
      const result = await this.productPartService.getList(
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

  @Get('/:productPartId')
  async getDetail(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Param('productPartId', ProductPartID) productPartId: string,
  ) {
    try {
      const result = await this.productPartService.getDetail(productPartId);
      return res.status(HttpStatus.OK).json({
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Delete('/:productPartId')
  async delete(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Param('productPartId', ProductPartID) productPartId: string,
  ) {
    try {
      await this.productPartService.delete(productPartId);
      return res.status(HttpStatus.OK).json({
        message: 'Delete ProductPart successfully',
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Put('/:productPartId')
  async update(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Body() productPartDTO: UpdateProductPartDTO,
    @Param('productPartId', ProductPartID) productPartId: string,
  ) {
    try {
      const result = await this.productPartService.update(
        productPartId,
        productPartDTO,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Update ProductPart successfully',
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }
}
