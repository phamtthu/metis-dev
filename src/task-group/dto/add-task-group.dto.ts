import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  Validate,
  ValidateIf,
} from 'class-validator';
import { BoardExistValidator } from 'src/board/custom-validator/board-id-existence.validator';
import { TaskStatusExistValidator } from 'src/task-status/custom-validator/task-status-id-existence.validator';

export class AddTaskGroupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ValidateIf((object, value) => value !== null)
  name: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  cover_background: string;

  @IsMongoId()
  @IsNotEmpty()
  @Validate(TaskStatusExistValidator)
  status: string;

  @IsMongoId()
  @IsNotEmpty()
  @Validate(BoardExistValidator)
  board: string;
}
