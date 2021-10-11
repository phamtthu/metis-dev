import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { ResourceResponse } from 'src/resource/response/resource-response';
import { SequenceResponse } from 'src/sequence/response/sequence-response';
import { ProcessResponse } from 'src/process/response/process-response';
import { UserResponse } from 'src/user/response/response/user-response';

@Exclude()
export class SequenceDetailResponse extends SequenceResponse {
  @Expose()
  @Type(() => ProcessResponse)
  process: ProcessResponse;

  @Expose()
  @Type(() => ResourceResponse)
  resources: ResourceResponse[];

  @Expose()
  @Type(() => UserResponse)
  users: UserResponse[];

  constructor(partial: Partial<SequenceDetailResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}
