import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class TokenVerifyDto {
    @IsNotEmpty()
    @IsString()
    readonly token: string;

}
