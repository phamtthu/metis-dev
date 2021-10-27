import { Injectable } from '@nestjs/common';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  Validate,
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BoardExistValidator } from 'src/board/custom-validator/board-id-existence.validator';
import { TaskGroupExistValidator } from 'src/task-group/custom-validator/task-group-id-existence.validator';
const hexColorRegex = require('hex-color-regex');

@ValidatorConstraint({ name: 'ImageLinkOrHexColor', async: false })
@Injectable()
export class ImageLinkOrHexColor implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    try {
      const validUrlRegex = new RegExp(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
      );
      if (value === null) return true;
      else if (value.length === value.match(validUrlRegex)[0].length)
        return true;
      else if (hexColorRegex({ strict: true }).test(value)) return true;
      else return false;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'cover_background is invalid (only Image link or Hex color are allow and null for blank)';
  }
}

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
  @Validate(ImageLinkOrHexColor)
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
