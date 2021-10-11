import { Type } from 'class-transformer';
import { LabelResponse } from './label-response';

export class LabelsResponse {
  @Type(() => LabelResponse)
  data: LabelResponse[];

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
  constructor(partial: Partial<LabelsResponse>) {
    Object.assign(this, partial);
  }
}
