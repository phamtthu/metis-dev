import {
  Body,
  Delete,
  HttpStatus,
  NotFoundException,
  Post,
  Put,
  Query,
  Request,
  Response,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { throwCntrllrErr } from 'src/common/utils/error';
import { AddResourceDTO } from './dto/add-resource.dto';
import { UpdateResourceDTO } from './dto/update-resource.dto';
import { ResourceService } from './resource.service';

import { getOriginURL } from 'src/shared/helper';

@Controller('api/resource')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
export class ResourceController {
  constructor(private resoureService: ResourceService) {}

  @Post()
  async create(@Request() req, @Body() resourceDTO: AddResourceDTO) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.resoureService.create(resourceDTO, originURL);
      return {
        message: 'Create Resource successfully',
        data: result,
      };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get()
  async getList(@Request() req, @Query() queryDto: PaginationQueryDto) {
    try {
      const result = await this.resoureService.getList(queryDto);
      return { data: result };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get('/:resourceId')
  async getDetail(@Request() req, @Param('resourceId') resourceId: string) {
    try {
      const result = await this.resoureService.getDetail(resourceId);
      return { data: result };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Delete('/:resourceId')
  async delete(@Request() req, @Param('resourceId') resourceId: string) {
    try {
      await this.resoureService.delete(resourceId);
      return {
        message: 'Delete Resource successfully',
      };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  //  Add User to Resource
  @Put('/:resourceId')
  async update(
    @Request() req,
    @Body() resourceDTO: UpdateResourceDTO,
    @Param('resourceId') resourceId: string,
  ) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.resoureService.update(
        resourceId,
        resourceDTO,
        originURL,
      );
      return {
        message: 'Update Resource successfully',
        data: result,
      };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }
}
