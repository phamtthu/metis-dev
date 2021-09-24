import {
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
} from "class-validator"
import { LaborIDsExistenceValidator } from "src/labor/custom-validator/laborIds.validator"

export class AddWorkCenterDTO {

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string

    @IsString()
    @IsNotEmpty()
    @Matches(/\b[a-zA-Z]{2}[0-9]{3}\b/, {
        message: 'work_center_no must follow 2 Numbers and 3 Letters, Ex: 00AAA'
    })
    work_center_no: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    description: string

    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    estimated_mhs: number

    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    avg_mhs: number

    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    total_mhs: number

    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    output: number

    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    actual: number

    @IsArray()
    @Validate(LaborIDsExistenceValidator)
    labors: string[]

}