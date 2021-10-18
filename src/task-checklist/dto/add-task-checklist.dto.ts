import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  Validate,
  ValidateIf,
} from 'class-validator';
import { TaskExistValidator } from 'src/task/custom-validator/task-id-existence.validator';

export class AddTaskChecklistDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsMongoId()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  @Validate(TaskExistValidator)
  task: string;
}
