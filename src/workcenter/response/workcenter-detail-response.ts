import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { WorkCenterResponse } from './workcenter-response';
import { ResourceResponse } from 'src/resource/response/resource-response';
import { UserResponse } from 'src/user/response/response/user-response';
import { ProductWorkCenterResponse } from 'src/product-workcenter/response/product-workcenter-response';

@Exclude()
export class WorkCenterDetailResponse extends WorkCenterResponse {
  @Expose()
  @Type(() => ResourceResponse)
  resources: ResourceResponse[];

  @Expose()
  @Type(() => UserResponse)
  users: UserResponse[];

  @Expose()
  @Type(() => ProductWorkCenterResponse)
  productWorkCenters: ProductWorkCenterResponse[];

  constructor(partial: Partial<WorkCenterDetailResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}
