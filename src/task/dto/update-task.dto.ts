import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  NotEquals,
  Validate,
  ValidateIf,
} from 'class-validator';
import { LabelIDsExistenceValidator } from 'src/label/custom-validator/label-ids-existence.validator';
import { UserIDsExistenceValidator } from 'src/user/custom-validator/user-ids.validator';
import { AddTaskDto } from './add-task.dto';

export class UpdateTaskDto extends PartialType(AddTaskDto) {
  // ISO String 
  @IsOptional()
  @IsNotEmpty()
  plan_start_date: Date;

  @IsOptional()
  @IsNotEmpty()
  plan_end_date: Date;

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
