import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class AddCustomerDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}
