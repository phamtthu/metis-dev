import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { Role } from 'src/common/enum/filter.enum';

export class AddUserDTO {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  title: string;

  @IsPositive()
  @Min(0)
  @IsNotEmpty()
  group_level: number;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  department: string;

  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  cost_per_hour: number;

  @IsBoolean()
  @IsNotEmpty()
  is_parttime: boolean;

  @IsOptional()
  @IsEnum([Role])
  roles: string[];
}
