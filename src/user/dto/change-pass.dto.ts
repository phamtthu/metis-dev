import { IsNotEmpty, IsString, ValidatorConstraintInterface, Validate, ValidatorConstraint, ValidationArguments } from "class-validator";
@ValidatorConstraint({ name: 'validatePassword', async: false })
export class ValidatePasswordLength implements ValidatorConstraintInterface {
    validate(text: string, args: ValidationArguments) {
        return text.length >= 6 && text.length <= 20;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Password must be 6 to 20 character ';
    }
}

export class ChangePassDto {
    @IsString()
    @IsNotEmpty()
    @Validate(ValidatePasswordLength)
    password: string;
}