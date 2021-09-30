import {
    IsNotEmpty,
    IsString,
    MaxLength,
} from "class-validator"

export class AddLabelDTO {

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string

}