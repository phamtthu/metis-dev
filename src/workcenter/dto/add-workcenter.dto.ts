import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
  Validate,
} from 'class-validator';
import { ResourceIDsExistenceValidator } from 'src/resource/custom-validator/resourceIds-existence-validator';
import { UserIDsExistenceValidator } from 'src/user/custom-validator/userIds.validator';

export class AddWorkCenterDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\b[a-zA-Z]{2}[0-9]{3}\b/, {
    message: 'workcenter_no must follow 2 Letter and 3 Number, Ex: AA000',
  })
  workcenter_no: string;

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
