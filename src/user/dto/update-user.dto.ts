import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Validate,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    IsArray,
    IsOptional,
    IsBoolean,
} from 'class-validator';
@ValidatorConstraint({ name: 'validatePhone', async: false })
export class ValidatePhoneLength implements ValidatorConstraintInterface {
    validate(text: string, args: ValidationArguments) {
        return text.length >=8 && text.length < 12;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Incorrect phone number';
    }
}

export class UpdateUserDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    @IsOptional()
    auto_accept_connect: boolean;

    @IsString()
    @IsOptional()
    avatar: string;

    @IsString()
    @IsOptional()
    address: string;

    @IsString()
    @IsEmail()
    @IsOptional()
    email: string

    @IsString()
    @Validate(ValidatePhoneLength)
    @IsNotEmpty()
    phone: string;

    @IsArray()
    @IsOptional()
    portrait_image: Array<Object>

    @IsArray()
    @IsOptional()
    id_card_image: Array<Object>

    @IsArray()
    @IsOptional()
    certicate_image: Array<String>

    @IsArray()
    @IsOptional()
    locations: Array<any>

    @IsOptional()
    approve_status: number
}