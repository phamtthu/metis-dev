import { IsMongoId, IsNotEmpty, IsString, Matches, MaxLength, Validate, ValidateIf } from 'class-validator';
import { TaskExistValidator } from 'src/task/custom-validator/task-id-existence.validator';

export class AddCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsMongoId()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  @Validate(TaskExistValidator)
  task: string;
}
