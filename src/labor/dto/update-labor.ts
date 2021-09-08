import {
    IsNotEmpty,
    IsOptional,
    IsPositive,
    IsString,
    IsUrl,
    Max,
    Min,
} from "class-validator"

export class UpdateLaborDTO {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    labor_no: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    work_center: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    skill: string

    @IsOptional()
    @IsUrl({ require_tld: false })
    @IsNotEmpty()
    avatar: string

    @IsOptional()
    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    unit_labor_cost: number

    @IsOptional()
    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    output: number

    @IsOptional()
    @IsPositive()
    @Max(100)
    @Min(0)
    @IsNotEmpty()
    efficiency: number
    
}