import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateReportDto {
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  working_time: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  issues: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  status: string;
}
