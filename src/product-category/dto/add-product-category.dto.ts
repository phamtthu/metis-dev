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
import { PCategoryIDExistenceValidator } from '../custom-validator/pcategory-id-existence.validator';

export class AddPCategoryDTO {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsMongoId()
  @ValidateIf((object, value) => value !== null)
  @Validate(PCategoryIDExistenceValidator)
  parent: string;

  @IsUrl({ require_tld: false })
  image: string;

  @IsString()
  @MaxLength(200)
  description: string;
}
