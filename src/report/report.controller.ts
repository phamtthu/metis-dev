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
import { AddReportDto } from './dto/add-report.dto';
import { ReportService } from './report.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/common/enum/filter.enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { BoardMemberGuard } from 'src/auth/guard/board-members.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportQueryDto } from './dto/report-query.dto';

@Controller('api/report')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
@UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.Employee)
  async create(@Request() req, @Body() reportDto: AddReportDto) {
    try {
      const result = await this.reportService.create(reportDto, req.user._id);
      return {
        message: 'Create Report successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  // GET all Report of User
  @Get('/user')
  @UseGuards(RolesGuard)
  @Roles(Role.Employee)
  async getList(@Request() req, @Query() queryDto: PaginationQueryDto) {
    try {
      const result = await this.reportService.getList(queryDto, req.user._id);
      return result;
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/stats')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async getStats(@Request() req, @Query() reportQuery: ReportQueryDto) {
    try {
      console.log(reportQuery);
      const result = await this.reportService.getStats(reportQuery);
      return result;
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/:reportId')
  @UseGuards(RolesGuard)
  @Roles(Role.Employee)
  async getDetail(@Request() req, @Param('reportId') reportId: string) {
    try {
      const result = await this.reportService.getDetail(reportId, req.user._id);
      return { data: result };
    } catch (error) {
      messageError(error);
    }
  }

  @Put('/:reportId')
  @UseGuards(RolesGuard)
  @Roles(Role.Employee)
  async update(
    @Request() req,
    @Body() reportDto: UpdateReportDto,
    @Param('reportId') reportId: string,
  ) {
    try {
      const result = await this.reportService.update(
        reportId,
        req.user._id,
        reportDto,
      );
      return {
        message: 'Update Report successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Delete('/:reportId')
  @UseGuards(RolesGuard)
  @Roles(Role.Employee)
  async softDelete(@Request() req, @Param('reportId') reportId: string) {
    try {
      await this.reportService.softDelete(reportId, req.user._id);
      return {
        message: 'Soft Delete Report successfully',
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Get('restore/:reportId')
  @UseGuards(RolesGuard)
  @Roles(Role.Employee)
  async restore(@Request() req, @Param('reportId') reportId: string) {
    try {
      const result = await this.reportService.restore(reportId, req.user._id);
      return {
        message: 'Restore Report successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }
}
