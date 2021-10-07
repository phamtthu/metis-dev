import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { UserResponse } from './user-response';
import { ResourceResponse } from 'src/resource/response/resource-response';
import { WorkCenterResponse } from 'src/workcenter/response/workcenter-response';
import { SequenceResponse } from 'src/sequence/response/sequence-response';
import { TaskResponse } from 'src/task/response/task-response';

@Exclude()
export class UserDetailResponse extends UserResponse {
  @Expose()
  @Type(() => ResourceResponse)
  resources: ResourceResponse[];

  @Expose()
  @Type(() => WorkCenterResponse)
  workcenters: WorkCenterResponse[];

  @Expose()
  @Type(() => WorkCenterResponse)
  sequences: SequenceResponse[];

  @Expose()
  @Type(() => TaskResponse)
  tasks: TaskResponse[];

  constructor(partial: Partial<UserDetailResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}
