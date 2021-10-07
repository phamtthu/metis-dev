import { Type } from 'class-transformer';
import { SequenceResponse } from './sequence-response';

export class SequencesResponse {
  @Type(() => SequenceResponse)
  data: SequenceResponse[];

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
  constructor(partial: Partial<SequencesResponse>) {
    Object.assign(this, partial);
  }
}
