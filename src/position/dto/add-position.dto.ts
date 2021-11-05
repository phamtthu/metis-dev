import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AddPositionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}
