import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class AddWorkCenterDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  avg_working_hours: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  avg_labor_cost: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  avg_output: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  time_before_production: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  description: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  estimated_mhs: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  avg_mhs: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  total_mhs: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  out_mtd: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  eff_mtd: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  o_target: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  output: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  target: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  actual: number;
}
