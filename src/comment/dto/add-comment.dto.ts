import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, Validate, ValidateIf } from 'class-validator';
import { AttachmentExistValidator } from 'src/attachment/custom-validator/attachment-ids-existence.validator';
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

  @IsArray()
  @IsMongoId({ each: true })
  @Validate(AttachmentExistValidator)
  attachments: string[];
}
