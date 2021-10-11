import { Type } from 'class-transformer';
import { SkillResponse } from './skill-response';

export class SkillsResponse {
  @Type(() => SkillResponse)
  data: SkillResponse[];

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
  constructor(partial: Partial<SkillsResponse>) {
    Object.assign(this, partial);
  }
}
