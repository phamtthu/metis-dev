import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsMongoId, IsOptional, Validate } from 'class-validator';
import { UserIDsExistenceValidator } from 'src/user/custom-validator/user-ids.validator';
import { AddResourceDTO } from './add-resource.dto';

export class UpdateResourceDTO extends PartialType(AddResourceDTO) {
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @Validate(UserIDsExistenceValidator)
  users: string[];
}
