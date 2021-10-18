import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsOptional, IsPositive, ValidateIf } from 'class-validator';
import { AddTaskChecklistDto } from './add-task-checklist.dto';

export class UpdateTaskChecklistDto extends PartialType(AddTaskChecklistDto) {
  @IsOptional()
  @IsPositive()
  @ValidateIf((object, value) => value !== 0)
  index: number;

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  is_complete: Boolean;
}
