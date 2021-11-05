import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  Validate,
  ValidateIf,
} from 'class-validator';
import { Role, Status } from 'src/common/enum/filter.enum';
import { PositionExistValidator } from 'src/position/custom-validator/position-exist-validator';
import { SkillExistValidator } from 'src/skill/custom-validator/skill-id-existence.validator';

export class Skill {
  @IsMongoId()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  @Validate(SkillExistValidator)
  skill: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(5)
  level: number;
}

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

  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  cost_per_hour: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  output: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  efficiency: number;

  @IsBoolean()
  @IsNotEmpty()
  is_parttime: boolean;

  @IsOptional()
  @IsEnum([Role])
  roles: string[];

  @IsMongoId()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  @Validate(PositionExistValidator)
  position: string;

  @IsNotEmpty()
  @IsEnum(Status)
  status: number;

  @IsString()
  @IsOptional()
  note: string;

  @IsArray()
  @IsNotEmpty()
  @Type(() => Skill)
  skills: Skill[];
}
