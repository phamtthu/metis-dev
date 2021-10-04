import {
  IsMongoId,
  IsString,
  IsUrl,
  MaxLength,
  Validate,
  ValidateIf,
} from 'class-validator';
import { Status } from 'src/common/enum/filter.enum';
import { PartCategoryIDExistenceValidator } from '../custom-validator/part-category-id-existence.validator';

export class AddPCategoryDTO {
  @IsString()
  @MaxLength(50)
  name: string;

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
