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
import { messageError } from 'src/common/utils/error';
import { PartService } from './part.service';
import { AddPartDTO } from './dto/add-part.dto';
import { UpdatePartDTO } from './dto/update-part.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('api/part')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
export class PartController {
  constructor(private partService: PartService) {}

  @Post()
  async create(@Request() req, @Body() productPartDTO: AddPartDTO) {
    try {
      const result = await this.partService.create(productPartDTO);
      return {
        message: 'Create Part successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Get()
  async getList(@Request() req, @Query() queryDto: PaginationQueryDto) {
    try {
      const result = await this.partService.getList(queryDto);
      return result;
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/:partId')
  async getDetail(@Request() req, @Param('partId') partId: string) {
    try {
      const result = await this.partService.getDetail(partId);
      return { data: result };
    } catch (error) {
      messageError(error);
    }
  }

  @Delete('/:partId')
  async delete(@Request() req, @Param('partId') partId: string) {
    try {
      await this.partService.delete(partId);
      return {
        message: 'Delete Part successfully',
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Put('/:partId')
  async update(
    @Request() req,
    @Body() productPartDTO: UpdatePartDTO,
    @Param('partId') partId: string,
  ) {
    try {
      const result = await this.partService.update(partId, productPartDTO);
      return {
        message: 'Update Part successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }
}
