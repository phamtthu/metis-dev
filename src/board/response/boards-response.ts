import { Type } from 'class-transformer';
import { BoardResponse } from './board-response';

export class BoardsResponse {
  @Type(() => BoardResponse)
  data: BoardResponse[];

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
  constructor(partial: Partial<BoardsResponse>) {
    Object.assign(this, partial);
  }
}
