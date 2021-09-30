import {
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsString,
    IsUrl,
    MaxLength,
    Validate,
    ValidateIf
} from "class-validator"
import { Status } from "src/common/enum/filter.enum"
import { RCategoryIDExistenceValidator } from "../custom-validator/rcategoryId-existence.validator"

export class AddRCategoryDTO {

    @IsString()
    @MaxLength(50)
    name: string

    @IsMongoId()
    @ValidateIf((object, value) => value !== null)
    @Validate(RCategoryIDExistenceValidator)
    parent: string

    @IsUrl({ require_tld: false })
    image: string

    @IsString()
    @MaxLength(200)
    description: string
}