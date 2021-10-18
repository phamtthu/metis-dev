import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';
import { AddLabelDTO } from './add-label.dto';

export class UpdateLabelDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cover_background: string;
}
