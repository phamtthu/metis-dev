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
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { LabelID } from 'src/shared/pipe/labelId.pipe';
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
  async create(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Body() labelDTO: AddLabelDTO,
  ) {
    try {
      const result = await this.labelService.create(labelDTO);
      return res.status(HttpStatus.CREATED).json({
        message: 'Create Label successfully',
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
      const result = await this.labelService.getList(
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

  @Get('user/:labelId')
  async getTasksWithGivenLabel(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Param('labelId', LabelID) labelId: string,
    @Query() paginateQuery: PaginationQueryDto,
  ) {
    try {
      const result = await this.labelService.getTasksWithGivenLabel(
        labelId,
        paginateQuery,
      );
      return res.status(HttpStatus.OK).json({
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get('/:labelId')
  async getDetail(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Param('labelId', LabelID) labelId: string,
  ) {
    try {
      const result = await this.labelService.getDetail(labelId);
      return res.status(HttpStatus.OK).json({
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Delete('/:labelId')
  async delete(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Param('labelId', LabelID) labelId: string,
  ) {
    try {
      await this.labelService.delete(labelId);
      return res.status(HttpStatus.OK).json({
        message: 'Delete Label successfully',
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Put('/:labelId')
  async update(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Body() labelDTO: UpdateLabelDTO,
    @Param('labelId', LabelID) labelId: string,
  ) {
    try {
      const result = await this.labelService.update(labelId, labelDTO);
      return res.status(HttpStatus.OK).json({
        message: 'Update Label successfully',
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }
}
