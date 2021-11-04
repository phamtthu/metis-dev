import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { TaskExistValidator } from 'src/task/custom-validator/task-id-existence.validator';

export class AddTaskChecklistDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsMongoId()
  @IsNotEmpty()
  @Validate(TaskExistValidator)
  task: string;
}
