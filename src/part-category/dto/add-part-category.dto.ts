import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
  Validate,
  ValidateIf,
} from 'class-validator';
import { Status } from 'src/common/enum/filter.enum';
import { PartCategoryIDExistenceValidator } from '../custom-validator/part-categoryId-existence.validator';

export class AddPCategoryDTO {
  @IsString()
  @MaxLength(50)
  name: string;

  // @IsEnum(Status)
  // is_active: number

  @IsMongoId()
  @ValidateIf((object, value) => value !== null)
  @Validate(PartCategoryIDExistenceValidator)
  parent: string;

  @IsUrl({ require_tld: false })
  image: string;

  @IsString()
  @MaxLength(200)
  description: string;
}
