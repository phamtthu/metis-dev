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
import { ResourceStatus } from "src/model/resource.shema"
import { RCategoryIDExistenceValidator } from "src/resource-category/custom-validator/rcategoryId-existence.validator"

export class AddResourceDTO {

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    equipment_name: string

    @IsString()
    @IsNotEmpty()
    @Matches(/\b[a-zA-Z]{2}[0-9]{3}\b/, {
        message: 'equipment_no must follow 2 Numbers and 3 Letters, Ex: 00AAA'
    })
    equipment_no: string

    @IsNotEmpty()
    @IsEnum(ResourceStatus)
    status: number

    @IsMongoId()
    @Validate(RCategoryIDExistenceValidator)
    category: string

    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    capacity: number

    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    description: string

    @IsUrl({ require_tld: false }, { each: true })
    images: string[]

    @IsString()
    @IsNotEmpty()
    serial_no: string

    @IsString()
    @IsNotEmpty()
    supplier_vendor: string

    @IsString()
    @IsNotEmpty()
    specification: string

    @IsString()
    @IsNotEmpty()
    work_instruction: string

    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    unit_cost: number

}