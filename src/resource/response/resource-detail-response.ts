import { ObjectId } from 'mongodb';
import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { ResourceCategoryResponse } from 'src/resource-category/response/resource-category-response';
import { UserResponse } from 'src/user/response/response/user-response';
import { WorkCenterResponse } from 'src/workcenter/response/workcenter-response';
import { SequenceResponse } from 'src/sequence/response/sequence-response';
import { ResourceResponse } from './resource-response';
@Exclude()
export class ResourceDetailResponse extends ResourceResponse {
  @Expose()
  @Type(() => ResourceCategoryResponse)
  category: ResourceCategoryResponse;

  @Expose()
  @Type(() => UserResponse)
  users: UserResponse;

  @Expose()
  @Type(() => WorkCenterResponse)
  workcenters: WorkCenterResponse;

  @Expose()
  @Type(() => SequenceResponse)
  sequences: SequenceResponse;

  constructor(partial: Partial<ResourceDetailResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}
