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
import { SequenceService } from './sequence.service';
import { AddSequenceDTO } from './dto/add-sequence.dto';
import { UpdateSequenceDTO } from './dto/update-sequence.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/common/enum/filter.enum';

@Controller('api/sequence')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
export class SequenceController {
  constructor(private sequenceService: SequenceService) {}

  @Post()
  async create(@Request() req, @Body() sequenceDTO: AddSequenceDTO) {
    try {
      const result = await this.sequenceService.create(sequenceDTO);
      return {
        message: 'Create Sequence successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Get()
  async getList(@Request() req, @Query() queryDto: PaginationQueryDto) {
    try {
      const result = await this.sequenceService.getList(queryDto);
      return result;
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/:sequenceId')
  async getDetail(@Request() req, @Param('sequenceId') sequenceId: string) {
    try {
      const result = await this.sequenceService.getDetail(sequenceId);
      return { result };
    } catch (error) {
      messageError(error);
    }
  }

  @Delete('/:sequenceId')
  async delete(@Request() req, @Param('sequenceId') sequenceId: string) {
    try {
      await this.sequenceService.delete(sequenceId);
      return {
        message: 'Delete Sequence successfully',
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Put('/:sequenceId')
  async update(
    @Request() req,
    @Body() sequenceDTO: UpdateSequenceDTO,
    @Param('sequenceId') sequenceId: string,
  ) {
    try {
      const result = await this.sequenceService.update(sequenceId, sequenceDTO);
      return {
        message: 'Update Sequence successfully',
        dta: result,
      };
    } catch (error) {
      messageError(error);
    }
  }
}
