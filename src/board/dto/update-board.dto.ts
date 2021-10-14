import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateBoardDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}
