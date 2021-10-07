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
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { LabelService } from './label.service';
import { AddLabelDTO } from './dto/add-label.dto';
import { UpdateLabelDTO } from './dto/update-label.dto';

@Controller('api/label')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
export class LabelController {
  constructor(private labelService: LabelService) {}

  @Post()
  async create(@Request() req, @Body() labelDTO: AddLabelDTO) {
    try {
      const result = await this.labelService.create(labelDTO);
      return {
        message: 'Create Label successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Get()
  async getList(@Request() req, @Query() queryDto: PaginationQueryDto) {
    try {
      const result = await this.labelService.getList(queryDto);
      return result;
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/:labelId')
  async getDetail(@Request() req, @Param('labelId') labelId: string) {
    try {
      const result = await this.labelService.getDetail(labelId);
      return {
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Delete('/:labelId')
  async delete(@Request() req, @Param('labelId') labelId: string) {
    try {
      await this.labelService.delete(labelId);
      return {
        message: 'Delete Label successfully',
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Put('/:labelId')
  async update(
    @Request() req,
    @Body() labelDTO: UpdateLabelDTO,
    @Param('labelId') labelId: string,
  ) {
    try {
      const result = await this.labelService.update(labelId, labelDTO);
      return {
        message: 'Update Label successfully',
        daa: result,
      };
    } catch (error) {
      messageError(error);
    }
  }
}
