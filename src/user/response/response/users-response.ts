import { Type } from 'class-transformer';
import { UserResponse } from './user-response';

export class UsersResponse {
  @Type(() => UserResponse)
  data: UserResponse[];

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
  constructor(partial: Partial<UsersResponse>) {
    Object.assign(this, partial);
  }
}
