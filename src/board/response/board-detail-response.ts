import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { BoardResponse } from './board-response';
import { TaskGroupResponse } from './task-group-response';

@Exclude()
export class BoardDetailResponse extends BoardResponse {
  @Expose()
  @Type(() => TaskGroupResponse)
  task_groups: TaskGroupResponse[];

  constructor(partial: Partial<BoardDetailResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}
