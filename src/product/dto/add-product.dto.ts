import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
  Validate,
  ValidateNested,
} from 'class-validator';
import { ProductStatus } from 'src/model/product.schema';
import { PCategoryIDExistenceValidator } from 'src/product-category/custom-validator/pcategoryId-existence.validator';
import { ProductPartIDsExistenceValidator } from 'src/product-part/custom-validator/product-partIds-exitence.validator';
import { ResourceIDsExistenceValidator } from 'src/resource/custom-validator/resourceIds-existence-validator';
import { UserIDsExistenceValidator } from 'src/user/custom-validator/userIds.validator';

export class AddProductDTO {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @IsEnum(ProductStatus)
  @IsNotEmpty()
  status: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/\b[a-zA-Z]{2}[0-9]{3}\b/, {
    message: 'product_no must follow 2 Letter and 3 Number, Ex: AA000',
  })
  product_no: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(13)
  sku: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  description: string;

  @IsUrl({ require_tld: false }, { each: true })
  images: string[];

  @IsUrl({ require_tld: false }, { each: true })
  files: string[];

  @IsMongoId()
  @Validate(PCategoryIDExistenceValidator)
  category: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  size: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  weight: number;

  @IsString()
  @IsNotEmpty()
  specification: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  unit: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  unit_cost: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  product_lead: number;

  @IsArray()
  attributes: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  @Validate(ProductPartIDsExistenceValidator)
  parts: string[];

  // For Product WorkCenter
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  @Validate(UserIDsExistenceValidator)
  users: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  @Validate(ResourceIDsExistenceValidator)
  resources: string[];

  // work_center
}
