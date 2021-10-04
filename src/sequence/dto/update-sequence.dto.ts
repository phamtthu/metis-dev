import { PartialType } from '@nestjs/mapped-types';
import { AddSequenceDTO } from './add-sequence.dto';
import { ResourceIDsExistenceValidator } from 'src/resource/custom-validator/resource-ids-existence-validator';
import { UserIDsExistenceValidator } from 'src/user/custom-validator/user-ids.validator';
import { IsArray, IsMongoId, IsOptional, Validate } from 'class-validator';

export class UpdateSequenceDTO extends PartialType(AddSequenceDTO) {
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @Validate(ResourceIDsExistenceValidator)
  resources: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @Validate(UserIDsExistenceValidator)
  users: string[];
}
