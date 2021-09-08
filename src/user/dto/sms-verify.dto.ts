import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class SmsVerifyDto {
    @IsNotEmpty()
    @IsString()
    readonly verify_code: string;

}
