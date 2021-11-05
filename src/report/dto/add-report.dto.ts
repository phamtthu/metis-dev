import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Validate,
  ValidateIf,
} from 'class-validator';
import { BoardExistValidator } from 'src/board/custom-validator/board-id-existence.validator';

export class AddReportDto {
  @IsMongoId()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  @Validate(BoardExistValidator)
  board: string;

  @IsNumber()
  @IsNotEmpty()
  working_time: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  issues: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}
