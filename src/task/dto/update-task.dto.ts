import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsPositive,
  Validate,
  ValidateIf,
} from 'class-validator';
import { Status } from 'src/common/enum/filter.enum';
import { LabelIDsExistenceValidator } from 'src/label/custom-validtor/label-ids-existence.validator';
import { UserIDsExistenceValidator } from 'src/user/custom-validator/user-ids.validator';
import { AddTaskDto } from './add-task.dto';

export class UpdateTaskDto extends PartialType(AddTaskDto) {
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @Validate(UserIDsExistenceValidator)
  users: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @Validate(LabelIDsExistenceValidator)
  labels: string[];

  @IsOptional()
  @IsPositive()
  @ValidateIf((object, value) => value !== 0)
  index: number;
}
