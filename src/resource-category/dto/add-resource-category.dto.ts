import {
  IsMongoId,
  IsString,
  IsUrl,
  MaxLength,
  Validate,
  ValidateIf,
} from 'class-validator';
import { ResourceCategoryIDExistenceValidator } from '../custom-validator/resource-category-id-existence.validator';

export class AddRCategoryDTO {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsMongoId()
  @ValidateIf((object, value) => value !== null)
  @Validate(ResourceCategoryIDExistenceValidator)
  parent: string;

  @IsUrl({ require_tld: false })
  image: string;

  @IsString()
  @MaxLength(200)
  description: string;
}
