import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { LabelResponse } from 'src/label/response/label-response';
import { ProductWorkCenterResponse } from 'src/product-workcenter/response/product-workcenter-response';
import { ProductResponse } from 'src/product/response/product-response';
import { SkillResponse } from 'src/skill/response/skill-response';
import { TaskStatusResponse } from 'src/task-status/response/task-status-response';
import { UserResponse } from 'src/user/response/response/user-response';
import { TaskResponse } from './task-response';

@Exclude()
export class TaskDetailResponse extends TaskResponse {
  @Expose()
  @Type(() => TaskStatusResponse)
  status: TaskStatusResponse;

  @Expose()
  @Type(() => SkillResponse)
  skill: SkillResponse;

  @Expose()
  @Type(() => LabelResponse)
  labels: LabelResponse[];

  @Expose()
  @Type(() => ProductResponse)
  product: ProductResponse;

  @Expose()
  @Type(() => ProductWorkCenterResponse)
  product_workcenter: ProductWorkCenterResponse;

  @Expose()
  @Type(() => UserResponse)
  users: UserResponse[];

  constructor(partial: Partial<TaskDetailResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}
