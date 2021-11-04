import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsPositive()
  @ValidateIf((object, value) => value !== 0)
  index: number;

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  is_complete: Boolean;
}
