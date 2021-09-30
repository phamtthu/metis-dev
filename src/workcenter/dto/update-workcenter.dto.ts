import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsMongoId, IsOptional, Validate } from 'class-validator';
import { ResourceIDsExistenceValidator } from 'src/resource/custom-validator/resourceIds-existence-validator';
import { UserIDsExistenceValidator } from 'src/user/custom-validator/userIds.validator';
import { AddWorkCenterDTO } from './add-workcenter.dto';

export class UpdateWorkCenterDTO extends PartialType(AddWorkCenterDTO) {
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @Validate(UserIDsExistenceValidator)
  users: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @Validate(ResourceIDsExistenceValidator)
  resources: string[];
}
