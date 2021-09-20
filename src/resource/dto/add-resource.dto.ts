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
import { RCategoryIDExistenceValidator } from "src/resource-category/custom-validator/rcategoryId-existence.validator"
import { WorkCenterIDExistenceValidator } from "src/workcenter/custom-validator/workcenterId.validator"

enum Status {
    Ready = 1,
    Waiting = 0
}

export class AddResourceDTO {

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    equipment_name: string

    @IsNotEmpty()
    @IsEnum(Status)
    status: number

    @IsString()
    @IsNotEmpty()
    @Matches(/\b[a-zA-Z]{2}[0-9]{3}\b/, {
        message: 'Resource_no must follow 2 Numbers and 3 Letters, Ex: 00AAA'
    })
    resource_no: string

    @IsMongoId()
    @Validate(RCategoryIDExistenceValidator)
    category: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    description: string
    
    @IsUrl({ require_tld: false }, { each: true })
    images: string[]

    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    work_hours: number

    @IsMongoId()
    @Validate(WorkCenterIDExistenceValidator)
    work_center: string

    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    unit_cost: number

    @IsArray()
    @Validate(LaborIDsExistenceValidator)
    labors: string[]

}