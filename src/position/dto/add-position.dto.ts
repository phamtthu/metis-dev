import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Status } from 'src/common/enum/filter.enum';

export class AddPositionDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsEnum(Status)
  is_active: number;
}
