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
import { SequenceConstraint } from 'src/model/sequence.schema';
import { ProcessIDExistenceValidator } from 'src/process/custom-validator/processId-existence.validator';
import { ResourceIDsExistenceValidator } from 'src/resource/custom-validator/resourceIds-existence-validator';
import { UserIDsExistenceValidator } from 'src/user/custom-validator/userIds.validator';
import { SequenceIDExistenceValidator } from '../custom-validator/sequenceId-existence.validator';

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

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  @Validate(ResourceIDsExistenceValidator)
  resources: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  @Validate(UserIDsExistenceValidator)
  users: string[];

  @IsMongoId()
  @ValidateIf((object, value) => value !== null)
  @IsNotEmpty()
  @Validate(SequenceIDExistenceValidator)
  parent: string;

  @IsOptional()
  @IsEnum(SequenceConstraint)
  constraint: number;
}
