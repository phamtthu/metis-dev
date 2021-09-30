import {
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength
} from "class-validator"

export class AddCustomerDTO {

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string

    @IsString()
    @IsNotEmpty()
    @Matches(/\b[a-zA-Z]{2}[0-9]{3}\b/, {
        message: 'customer_no must follow 2 Letter and 3 Number, Ex: AA000'
    })
    customer_no: string

}