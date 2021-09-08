import { IsNotEmpty, IsString, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, IsNumber, IsOptional } from "class-validator";
@ValidatorConstraint({ name: 'validatePhone', async: false })
export class ValidatePhoneLength implements ValidatorConstraintInterface {
    validate(text: string, args: ValidationArguments) {
        return text.length >=8 && text.length <= 12;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Incorrect phone number';
    }
}

@ValidatorConstraint({ name: 'validatePassword', async: false })
export class ValidatePasswordLength implements ValidatorConstraintInterface {
    validate(text: string, args: ValidationArguments) {
        return text.length >= 6 && text.length <= 20;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Password must be 6 to 20 character ';
    }
}

export class RegistDto {

    @IsString()
    name: string;

    @IsString()
    @Validate(ValidatePhoneLength)
    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    @IsString()
    @Validate(ValidatePasswordLength)
    password: string;

    @IsNumber()
    user_type: number

    @IsString()
    @IsOptional()
    device_token: string

    @IsString()
    @IsNotEmpty()
    country_code: string;

    @IsString()
    @IsNotEmpty()
    dial_code: string

}