import { Type } from "class-transformer";
import {
    ArrayNotEmpty,
    IsArray,
    IsEmail,
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
    ValidateNested,
} from "class-validator"
import { ProductPartStatus } from "src/model/productpart.schema";
import { PartCategoryIDExistenceValidator } from "src/part-category/custom-validator/part-categoryId-existence.validator";

export class AddProductPartDTO {

    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    name: string

    @IsEnum(ProductPartStatus)
    @IsNotEmpty()
    status: number

    @IsString()
    @IsNotEmpty()
    @Matches(/\b[a-zA-Z]{2}[0-9]{3}\b/, {
        message: 'material_no must follow 2 Letter and 3 Number, Ex: AA000'
    })
    material_no: string

    @IsMongoId()
    @Validate(PartCategoryIDExistenceValidator)
    category: string

    @IsPositive()
    @Min(0)
    @IsNotEmpty()
    quantity: number

    @IsUrl({ require_tld: false }, { each: true })
    images: string[]

    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    unit_cost: number

    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    unit_price: number

    @IsString()
    @IsNotEmpty()
    description

}