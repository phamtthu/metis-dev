import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Validate,
  ValidateIf,
} from 'class-validator';
import { AttachmentTypes } from 'src/model/attachment/attachment-schema';
import { TaskExistValidator } from 'src/task/custom-validator/task-id-existence.validator';

export class AddAttachmentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(AttachmentTypes)
  @IsNotEmpty()
  type: number;

  @IsUrl({ require_tld: false })
  link: string;

  @IsMongoId()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  @Validate(TaskExistValidator)
  task: string;
}
