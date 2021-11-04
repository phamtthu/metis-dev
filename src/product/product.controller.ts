import {
  Body,
  Delete,
  HttpStatus,
  Post,
  Put,
  Query,
  Request,
  Response,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { messageError } from 'src/common/utils/error';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ProductService } from './product.service';
import { AddProductDTO } from './dto/add-product.dto';
import { getOriginURL } from 'src/shared/helper';
import { UpdateProductDTO } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/common/enum/filter.enum';

@Controller('api/product')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
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
      messageError(error);
    }
  }

  @Get()
  async getList(@Request() req, @Query() queryDto: PaginationQueryDto) {
    try {
      const result = await this.productService.getList(queryDto);
      return result;
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/:productId')
  async getDetail(@Request() req, @Param('productId') productId: string) {
    try {
      const result = await this.productService.getDetail(productId);
      return { data: result };
    } catch (error) {
      messageError(error);
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
      messageError(error);
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
      messageError(error);
    }
  }
}
