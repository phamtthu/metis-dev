import { Type } from "class-transformer";
import {
    ArrayNotEmpty,
    IsArray,
    IsEmail,
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsPositive,
    IsString,
    IsUrl,
    Matches,
    Max,
    MaxLength,
    Min,
    Validate,
    ValidateNested,
} from "class-validator"
import { Status } from "src/common/enum/filter.enum";
import { PositionIDExistenceValidator } from "src/position/custom-validator/positionId-existence.validator";
import { SkillIDExistenceValidator } from "src/skill/custom-validator/skillId-existence.validator";



export class Skill {
    @IsMongoId()
    @Validate(SkillIDExistenceValidator)
    skill: string;

    @IsEnum([1, 2, 3, 4, 5])
    level: number
}

export class AddLaborDTO {

    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    name: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    @Matches(/\b[a-zA-Z]{2}[0-9]{3}\b/, {
        message: 'Labor_no must follow 2 Numbers and 3 Letters, Ex: 00AAA'
    })
    labor_no: string

    @IsUrl({ require_tld: false })
    @IsNotEmpty()
    image: string

    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    unit_labor_cost: number

    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    output_month: number

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    note: string

    @IsEnum(Status)
    is_active: number

    @IsPositive()
    @Max(100)
    @Min(0)
    @IsNotEmpty()
    efficiency: number

    @IsArray()
    @ArrayNotEmpty()
    @Type(() => Skill)
    @ValidateNested({ each: true })
    skills: Skill[]

    @IsMongoId()
    @Validate(PositionIDExistenceValidator)
    position: string

}