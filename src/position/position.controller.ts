import {
  Body,
  Delete,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { messageError } from 'src/common/utils/error';
import { AddPositionDto } from './dto/add-position.dto';
import { PositionService } from './position.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/common/enum/filter.enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Controller('api/position')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
export class PositionController {
  constructor(private positionService: PositionService) {}

  @Post()
  async create(@Request() req, @Body() positionDto: AddPositionDto) {
    try {
      const result = await this.positionService.create(positionDto);
      return {
        message: 'Create Position successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Get()
  async getList(@Request() req, @Query() queryDto: PaginationQueryDto) {
    try {
      const result = await this.positionService.getList(queryDto);
      return result;
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/:positionId')
  async getDetail(@Request() req, @Param('positionId') positionId: string) {
    try {
      const result = await this.positionService.getDetail(positionId);
      return { data: result };
    } catch (error) {
      messageError(error);
    }
  }

  @Delete('/:positionId')
  async delete(@Request() req, @Param('positionId') positionId: string) {
    try {
      await this.positionService.delete(positionId);
      return {
        message: 'Delete Position successfully',
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Put('/:positionId')
  async update(
    @Request() req,
    @Body() positionDto: UpdatePositionDto,
    @Param('positionId') positionId: string,
  ) {
    try {
      const result = await this.positionService.update(positionId, positionDto);
      return {
        message: 'Update Position successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }
}
