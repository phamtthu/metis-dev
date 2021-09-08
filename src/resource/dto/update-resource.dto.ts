import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
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

export class UpdateResourceDTO {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    equipment_name: string

    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    @IsEnum(Status)
    status: number

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    number: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    category: string

    @IsOptional()
    @IsPositive()
    @Max(100)
    @Min(0)
    @IsNotEmpty()
    capacity: number

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description: string

    @IsOptional()
    @IsUrl({ require_tld: false }, { each: true })
    images: string[]

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    serial_no: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    supplier_vendor: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    specification: string

    @IsOptional()
    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    work_instruction: number

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    work_center: string

    @IsOptional()
    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    unit_cost: number

    @IsOptional()
    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    output: number

    @IsOptional()
    @IsPositive()
    @Min(0)
    @Max(100)
    @IsNotEmpty()
    efficiency: number

    @IsOptional()
    @IsArray()
    @Validate(LaborIDsExistenceValidator)
    labors: any

}