import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { TaskChecklistExistValidator } from 'src/task-checklist/custom-validator/task-checklist-exist.validator';

export class AddItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsMongoId()
  @IsNotEmpty()
  @Validate(TaskChecklistExistValidator)
  task_checklist: string;
}
