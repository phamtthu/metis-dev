import { PartialType } from '@nestjs/mapped-types';
import { IsHexColor, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';
import { AddLabelDTO } from './add-label.dto';

export class UpdateLabelDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsHexColor()
  @IsNotEmpty()
  cover_background: string;
}
