import {
  IsNotEmpty,
  IsString,
  ValidatorConstraintInterface,
  Validate,
  ValidatorConstraint,
  ValidationArguments,
  IsOptional, IsNumber,
} from 'class-validator';

@ValidatorConstraint({ name: 'validatePassword', async: false })
export class ValidatePasswordLength implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return text.length >= 6 && text.length <= 20;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password must be 6 to 20 character ';
  }
}

export class ValidatePhoneLength implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return text.length >= 8 && text.length <= 12;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Incorrect phone number';
  }
}

export class ChangePassDto {
  @IsString()
  @IsNotEmpty()
  change_code: string;

  @IsString()
  @IsNotEmpty()
  @Validate(ValidatePasswordLength)
  password: string;

  @IsString()
  @Validate(ValidatePhoneLength)
  @IsNotEmpty()
  phone: string;
}