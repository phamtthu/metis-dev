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
import { ProcessService } from './process.service';
import { AddProcessDTO } from './dto/add-process.dto';
import { UpdateProcessDTO } from './dto/update-process.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role } from 'src/common/enum/filter.enum';
import { Roles } from 'src/auth/roles.decorator';

@Controller('api/process')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
export class ProcessController {
  constructor(private processService: ProcessService) {}

  @Post()
  async create(@Request() req, @Body() processDTO: AddProcessDTO) {
    try {
      const result = await this.processService.create(processDTO);
      return {
        message: 'Create Process successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Get()
  async getList(@Request() req, @Query() queryDto: PaginationQueryDto) {
    try {
      const result = await this.processService.getList(queryDto);
      return result;
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/:processId')
  async getDetail(@Request() req, @Param('processId') processId: string) {
    try {
      const result = await this.processService.getDetail(processId);
      return { data: result };
    } catch (error) {
      messageError(error);
    }
  }

  @Delete('/:processId')
  async delete(@Request() req, @Param('processId') processId: string) {
    try {
      await this.processService.delete(processId);
      return {
        message: 'Delete Process successfully',
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Put('/:processId')
  async update(
    @Request() req,
    @Body() processDTO: UpdateProcessDTO,
    @Param('processId') processId: string,
  ) {
    try {
      const result = await this.processService.update(processId, processDTO);
      return {
        message: 'Update Process successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }
}
