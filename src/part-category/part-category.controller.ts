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
import { AddPCategoryDTO } from './dto/add-part-category.dto';
import { PartCategoryService } from './part-category.service';
import { getOriginURL } from 'src/shared/helper';
import { UpdatePCategoryRDTO } from './dto/update-part-category.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/common/enum/filter.enum';

@Controller('api/part-category')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
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
      messageError(error);
    }
  }

  @Get()
  async getList(@Request() req, @Query() queryDto: PaginationQueryDto) {
    try {
      const result = await this.partCategoryService.getList(queryDto);
      return result;
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/:categoryId')
  async getDetail(@Request() req, @Param('categoryId') categoryId: string) {
    try {
      const result = await this.partCategoryService.getDetail(categoryId);
      return { data: result };
    } catch (error) {
      messageError(error);
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
      messageError(error);
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
      messageError(error);
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
      messageError(error);
    }
  }
}
