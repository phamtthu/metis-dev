import { IsEmail, IsNotEmpty, IsString, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, IsArray, IsOptional } from "class-validator";

export class CheckUserDto {
    @IsNotEmpty()
    readonly phone: string;
}