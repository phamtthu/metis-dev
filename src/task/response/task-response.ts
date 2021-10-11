import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { TaskStatusResponse } from 'src/task-status/response/task-status-response';
import { LabelResponse } from 'src/label/response/label-response';
import { SkillResponse } from 'src/skill/response/skill-response';
import { ProductResponse } from 'src/product/response/product-response';
import { ProductWorkCenterResponse } from 'src/product-workcenter/response/product-workcenter-response';

@Exclude()
export class TaskResponse {
  @Expose()
  _id?: ObjectId;

  @Expose()
  name: string;

  @Expose()
  task_no: string;

  @Expose()
  priority: number;

  @Expose()
  description: string;

  @Expose()
  images: string[];

  @Expose()
  plan_start_date: Date;

  @Expose()
  plan_end_date: Date;

  @Expose()
  start_date: Date;

  @Expose()
  end_date: Date;

  @Expose()
  plan_start_time: number;

  @Expose()
  plan_end_time: number;

  @Expose()
  start_time: number;

  @Expose()
  end_time: number;

  @Expose()
  extra_time: number;

  @Expose()
  est_time: number;

  @Expose()
  real_time: number;

  @Expose()
  percent: number;

  @Expose()
  comment: string;

  @Expose()
  @Type(() => SkillResponse)
  skill: string | SkillResponse;

  @Expose()
  @Type(() => LabelResponse)
  labels: string[] | LabelResponse[];

  @Expose()
  @Type(() => TaskStatusResponse)
  status: string | TaskStatusResponse;

  @Expose()
  @Type(() => ProductResponse)
  product: string | ProductResponse;

  @Expose()
  @Type(() => ProductWorkCenterResponse)
  product_workcenter: string | ProductWorkCenterResponse;

  @Expose()
  @Type(() => TaskStatusResponse)
  parent: string | TaskStatusResponse;

  @Expose()
  pre_task: string;

  @Expose()
  after_task: string;

  @Expose()
  @Type(() => TaskStatusResponse)
  children: TaskStatusResponse[];

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  __v: number;

  constructor(partial: Partial<TaskResponse>) {
    Object.assign(this, partial);
  }
}
