import { Exclude } from 'class-transformer';
import { TaskResponse } from './task-response';

@Exclude()
export class TaskDetailResponse extends TaskResponse {
  constructor(partial: Partial<TaskDetailResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}
