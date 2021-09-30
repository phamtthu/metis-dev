import {
    IsArray,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength
} from "class-validator"

export class AddProcessDTO {

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string

    @IsString()
    @IsNotEmpty()
    @Matches(/\b[a-zA-Z]{2}[0-9]{3}\b/, {
        message: 'process_no must follow 2 Letter and 3 Number, Ex: AA000'
    })
    process_no: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    description: string

    @IsArray()
    attributes: string[]

}