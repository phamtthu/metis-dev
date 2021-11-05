import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { throwCanNotDeleteErr, errorException } from 'src/common/utils/error';
import { Report } from 'src/model/report/report.schema';
import { AddReportDto } from './dto/add-report.dto';
import { ReportResponse } from './response/report-response';
import { classToPlain } from 'class-transformer';
import { paginator, toJsObject } from 'src/shared/helper';
import { SoftDeleteModel } from 'mongoose-delete';
import { ReportsResponse } from './response/reports-reponse';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportQueryDto } from './dto/report-query.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel('Report')
    private reportModel: PaginateModel<Report> & SoftDeleteModel<Report>,
  ) {}

  async create(reportDto: AddReportDto, userId: string) {
    try {
      const report = await new this.reportModel({
        created_by: userId,
        ...reportDto,
      }).save();
      return classToPlain(new ReportResponse(toJsObject(report)));
    } catch (error) {
      errorException(error);
    }
  }

  async getList(queryDto: PaginationQueryDto, userId: string) {
    try {
      const query = { created_by: userId };
      if (queryDto.offset >= 0 && queryDto.limit >= 0) {
        const options = {
          offset: queryDto.offset,
          limit: queryDto.limit,
          sort: { created_at: SortQuery.Desc },
          customLabels: {
            page: 'page',
            limit: 'per_page',
            totalDocs: 'total',
            totalPages: 'total_pages',
            docs: 'data',
          },
        };
        const reports = await this.reportModel.paginate(query, options);
        return classToPlain(new ReportsResponse(toJsObject(reports)));
      } else {
        const reports = await this.reportModel
          .find(query)
          .sort({ created_at: SortQuery.Desc });
        return classToPlain(
          new ReportsResponse(
            toJsObject(paginator(reports, 0, reports.length)),
          ),
        );
      }
    } catch (error) {
      errorException(error);
    }
  }

  async getDetail(reportId: string, userId: string) {
    try {
      const report = await this.checkReportOwnerShip(reportId, userId);
      return classToPlain(new ReportResponse(toJsObject(report)));
    } catch (error) {
      errorException(error);
    }
  }

  async update(reportId, userId, reportDto: UpdateReportDto) {
    try {
      await this.checkReportOwnerShip(reportId, userId);
      const newReport = await this.reportModel.findByIdAndUpdate(
        reportId,
        reportDto,
        { new: true },
      );
      if (!newReport) throw new NotFoundException('Report is not found');
      return classToPlain(new ReportResponse(toJsObject(newReport)));
    } catch (error) {
      errorException(error);
    }
  }

  async checkReportExist(reportId: string) {
    try {
      const report = await this.reportModel.findById(reportId).lean();
      if (!report) throw new NotFoundException('Report is not found');
      return report;
    } catch (error) {
      errorException(error);
    }
  }

  async checkReportOwnerShip(reportId: string, userId: string) {
    try {
      let report = await this.reportModel
        .findOne({
          _id: reportId,
          created_by: userId,
        })
        .lean();
      if (report) return report;
      report = await this.reportModel.findById(reportId);
      if (report) {
        throw new ForbiddenException(
          "You don't have permission to access this report",
        );
      } else {
        throw new NotFoundException('Report is not found');
      }
    } catch (error) {
      errorException(error);
    }
  }

  async softDelete(reportId: string, userId: string) {
    try {
      await this.checkReportOwnerShip(reportId, userId);
      const { n } = await this.reportModel.deleteById(reportId);
      if (n !== 1) throw new Error('Can not soft delete Report');
    } catch (error) {
      errorException(error);
    }
  }

  async restore(reportId: string, userId: string) {
    try {
      let report: any = await this.checkReportOwnerShip(reportId, userId);
      if (!report.deleted)
        throw new BadRequestException('Report is already restored');
      const { n } = await this.reportModel.restore({ _id: reportId });
      if (n !== 1) throw new Error('Can not restore Report');
      report = await this.reportModel.findById(reportId);
      return classToPlain(new Report(toJsObject(report)));
    } catch (error) {
      errorException(error);
    }
  }

  async getStats(reportQuery: ReportQueryDto) {
    try {
      return reportQuery;
    } catch (error) {
      errorException(error);
    }
  }
}
