import { Type } from 'class-transformer';
import { ReportResponse } from './report-response';

export class ReportsResponse {
  @Type(() => ReportResponse)
  data: ReportResponse[];

  total: number;
  offset: number;
  per_page: number;
  total_pages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: Boolean;
  hasNextPage: Boolean;
  prevPage: number | null;
  nextPage: number | null;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(partial: Partial<ReportsResponse>) {
    Object.assign(this, partial);
  }
}
