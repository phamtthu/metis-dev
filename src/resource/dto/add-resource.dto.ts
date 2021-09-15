import {
    IsArray,
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsString,
    IsUrl,
    Max,
    Min,
    Validate,
} from "class-validator"
import { LaborIDsExistenceValidator } from "src/labor/custom-validator/laborIds.validator"
import { RCategoryIDExistenceValidator } from "src/resource-category/custom-validator/rcategoryId-existence.validator"

enum Status {
    Ready = 1,
    Waiting = 0
}

export class AddResourceDTO {

    @IsString()
    @IsNotEmpty()
    equipment_name: string

    @IsNotEmpty()
    @IsEnum(Status)
    status: number

    @IsString()
    @IsNotEmpty()
    resource_no: string

    @IsMongoId()
    @Validate(RCategoryIDExistenceValidator)
    category: string

    @IsString()
    @IsNotEmpty()
    description: string
    
    @IsUrl({ require_tld: false }, { each: true })
    images: string[]

    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    work_hours: number

    /* TODO: Validate workcenter ID here */
    @IsString()
    @IsNotEmpty()
    work_center: string

    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    unit_cost: number

    @IsArray()
    @Validate(LaborIDsExistenceValidator)
    labors: string[]

}