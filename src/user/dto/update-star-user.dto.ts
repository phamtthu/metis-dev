import {
  IsNotEmpty,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  IsArray,
  IsOptional,
  IsNumber,
  IsMongoId,
} from 'class-validator';

export class UpdateStarUserDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly user_id: string;

  @IsNotEmpty()
  @IsNumber()
  readonly star: number;
}
