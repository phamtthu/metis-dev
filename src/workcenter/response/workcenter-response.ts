import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose } from 'class-transformer';

@Exclude()
export class WorkCenterResponse {
  @Expose()
  _id?: ObjectId;
  
  @Expose()
  name: string;

  @Expose()
  workcenter_no: string;

  @Expose()
  avg_working_hours: number;

  @Expose()
  avg_labor_cost: number;

  @Expose()
  avg_output: number;

  @Expose()
  time_before_production: number;

  @Expose()
  description: string;

  @Expose()
  estimated_mhs: number;

  @Expose()
  avg_mhs: number;

  @Expose()
  total_mhs: number;

  @Expose()
  out_mtd: number;

  @Expose()
  eff_mtd: number;

  @Expose()
  o_target: number;

  @Expose()
  output: number;

  @Expose()
  target: number;

  @Expose()
  actual: number;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  // Exclude
  __v: number;

  constructor(partial: Partial<WorkCenterResponse>) {
    Object.assign(this, partial);
  }
}
