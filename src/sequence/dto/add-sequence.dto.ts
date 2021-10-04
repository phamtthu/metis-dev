import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  Min,
  Validate,
  ValidateIf,
} from 'class-validator';
import { ObjectId } from 'mongoose';
import { SequenceConstraint } from 'src/model/sequence/sequence.schema';
import { ProcessIDExistenceValidator } from 'src/process/custom-validator/process-id-existence.validator';
import { SequenceIDExistenceValidator } from '../custom-validator/sequence-id-existence.validator';

export class AddSequenceDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsPositive()
  @IsNotEmpty()
  position_x: number;

  @IsPositive()
  @IsNotEmpty()
  position_y: number;

  @IsPositive()
  @IsNotEmpty()
  size_w: number;

  @IsPositive()
  @IsNotEmpty()
  size_h: number;

  @IsNotEmpty()
  start_date: Date;

  @IsNotEmpty()
  end_date: Date;

  /* TODO: validate color here */
  @IsString()
  @IsNotEmpty()
  title_color: string;

  @IsMongoId()
  @IsNotEmpty()
  @Validate(ProcessIDExistenceValidator)
  process: string;

  @IsMongoId()
  @ValidateIf((object, value) => value !== null)
  @IsNotEmpty()
  @Validate(SequenceIDExistenceValidator)
  parent: string;

  @IsOptional()
  @IsEnum(SequenceConstraint)
  constraint: number;
}
