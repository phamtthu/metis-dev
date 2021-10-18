import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Validate,
  ValidateIf,
} from 'class-validator';
import { BoardExistValidator } from 'src/board/custom-validator/board-id-existence.validator';
import { TaskGroupExistValidator } from 'src/task-group/custom-validator/task-group-id-existence.validator';

export class AddTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsEnum([1, 2, 3])
  @IsNotEmpty()
  priority: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  description: string;

  @IsNotEmpty()
  plan_start_date: Date;

  @IsNotEmpty()
  plan_end_date: Date;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((object, value) => value !== null)
  cover_background: string;

  @IsMongoId()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  @Validate(TaskGroupExistValidator)
  task_group: string;

  @IsMongoId()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  @Validate(BoardExistValidator)
  board: string;
}
