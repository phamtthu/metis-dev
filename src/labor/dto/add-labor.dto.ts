import {
    IsNotEmpty,
    IsPositive,
    IsString,
    IsUrl,
    Max,
    Min,
} from "class-validator"

export class AddLaborDTO {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    labor_no: string

    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    work_center: string

    @IsString()
    @IsNotEmpty()
    skill: string

    @IsUrl({ require_tld: false })
    @IsNotEmpty()
    avatar: string

    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    unit_labor_cost: number

    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    output: number

    @IsPositive()
    @Max(100)
    @Min(0)
    @IsNotEmpty()
    efficiency: number

}