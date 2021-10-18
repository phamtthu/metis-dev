import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTaskGroupDto {
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
