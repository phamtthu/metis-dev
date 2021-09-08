import { IsNotEmpty, IsOptional, IsString, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, IsNumber } from "class-validator";
@ValidatorConstraint({ name: 'validatePhone', async: false })
export class ValidatePhoneLength implements ValidatorConstraintInterface {
    validate(text: string, args: ValidationArguments) {
        return text.length >=8 && text.length < 12;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Incorrect phone number';
    }
}
export class LoginDto {

    @IsString()
    @Validate(ValidatePhoneLength)
    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsString()
    @IsOptional()
    device_token: string;

    @IsString()
    @IsNotEmpty()
    country_code: string;

    @IsString()
    @IsNotEmpty()
    dial_code: string

    @IsNumber()
    user_type: number

}