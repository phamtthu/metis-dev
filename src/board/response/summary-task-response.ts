import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { LabelResponse } from 'src/label/response/label-response';
import { TaskResponse } from 'src/task/response/task-response';
import { UserResponse } from 'src/user/response/response/user-response';

@Exclude()
export class SumaryTaskResponse extends TaskResponse {
  @Expose()
  task_checklist: string;

  @Expose()
  @Type(() => UserResponse)
  users: UserResponse[];

  @Expose()
  @Type(() => LabelResponse)
  labels: LabelResponse[];

  constructor(partial: Partial<SumaryTaskResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}
