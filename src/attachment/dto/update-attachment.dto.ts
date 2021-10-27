import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAttachmentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;
}
