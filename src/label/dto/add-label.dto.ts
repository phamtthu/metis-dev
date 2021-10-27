import {
  IsHexColor,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
  ValidateIf,
} from 'class-validator';
import { BoardExistValidator } from 'src/board/custom-validator/board-id-existence.validator';

export class AddLabelDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsHexColor()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  cover_background: string;

  @IsMongoId()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  @Validate(BoardExistValidator)
  board: string;
}
