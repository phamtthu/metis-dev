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
import { WorkCenterService } from './workcenter.service';
import { AddWorkCenterDTO } from './dto/add-workcenter.dto';
import { UpdateWorkCenterDTO } from './dto/update-workcenter.dto';
import { UpdateProductWorkCenterDTO } from './dto/update-product-workcenter.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/common/enum/filter.enum';

@Controller('api/workcenter')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
export class WorkCenterController {
  constructor(private workCenterService: WorkCenterService) {}

  @Post()
  async create(@Request() req, @Body() workCenterDTO: AddWorkCenterDTO) {
    try {
      const result = await this.workCenterService.create(workCenterDTO);
      return {
        message: 'Create Work Center successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Get()
  async getList(@Request() req, @Query() queryDto: PaginationQueryDto) {
    try {
      const result = await this.workCenterService.getList(queryDto);
      return result;
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/:workCenterId')
  async getDetail(@Request() req, @Param('workCenterId') workCenterId: string) {
    try {
      const result = await this.workCenterService.getDetail(workCenterId);
      return { data: result };
    } catch (error) {
      messageError(error);
    }
  }

  @Delete('/:workCenterId')
  async delete(@Request() req, @Param('workCenterId') workCenterId: string) {
    try {
      await this.workCenterService.delete(workCenterId);
      return {
        message: 'Delete Work Center successfully',
      };
    } catch (error) {
      messageError(error);
    }
  }

  // Add Resource, User to WC
  @Put('/:workCenterId')
  async update(
    @Request() req,
    @Body() workCenterDTO: UpdateWorkCenterDTO,
    @Param('workCenterId') workCenterId: string,
  ) {
    try {
      const result = await this.workCenterService.update(
        workCenterId,
        workCenterDTO,
      );
      return {
        message: 'Update Work Center successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Put('product/:workCenterId')
  async updateProductWorkCenter(
    @Request() req,
    @Body() workCenterDTO: UpdateProductWorkCenterDTO,
    @Param('workCenterId') workCenterId: string,
  ) {
    try {
      const result = await this.workCenterService.updateProductWorkCenter(
        workCenterId,
        workCenterDTO,
      );
      return {
        message: 'Update Product Work Center successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }
}
