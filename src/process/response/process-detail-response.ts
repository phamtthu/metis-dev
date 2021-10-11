import { Exclude, Transform, Expose, Type } from 'class-transformer';
import { ProcessResponse } from './process-response';
import { SequenceResponse } from 'src/sequence/response/sequence-response';

@Exclude()
export class ProcessDetailResponse extends ProcessResponse {
  @Expose()
  @Type(() => SequenceResponse)
  sequences: SequenceResponse[];


  constructor(partial: Partial<ProcessDetailResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}
