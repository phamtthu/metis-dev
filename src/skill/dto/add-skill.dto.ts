import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AddSkillDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}
