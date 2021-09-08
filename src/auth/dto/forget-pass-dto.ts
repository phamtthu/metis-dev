import { IsNotEmpty, IsString } from "class-validator";

export class ForgetPassDto {
    @IsString()
    @IsNotEmpty()
    phone: string;
}