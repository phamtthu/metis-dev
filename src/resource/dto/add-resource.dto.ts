import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsString,
    IsUrl,
    Max,
    Min,
    Validate,
} from "class-validator"
import { LaborIDsExistenceValidator } from "src/labor/custom-validator/laborIds.validation"

enum Status {
    Ready = 1,
    Waiting = 0
}

export class AddResourceDTO {

    @IsString()
    @IsNotEmpty()
    equipment_name: string

    @IsNumber()
    @IsNotEmpty()
    @IsEnum(Status)
    status: number

    @IsString()
    @IsNotEmpty()
    number: string

    @IsString()
    @IsNotEmpty()
    category: string

    @IsPositive()
    @Max(100)
    @Min(0)
    @IsNotEmpty()
    capacity: number

    @IsString()
    @IsNotEmpty()
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

    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    work_instruction: number

    @IsString()
    @IsNotEmpty()
    work_center: string

    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    unit_cost: number

    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    output: number

    @IsPositive()
    @Min(0)
    @Max(100)
    @IsNotEmpty()
    efficiency: number

    @IsArray()
    @Validate(LaborIDsExistenceValidator)
    labors: any

}