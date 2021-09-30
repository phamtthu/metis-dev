import { IsNotEmpty, IsString } from 'class-validator';

export class AddTaskStatusDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
