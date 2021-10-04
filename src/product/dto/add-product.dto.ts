import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  Min,
  Validate,
} from 'class-validator';
import { ProductStatus } from 'src/model/product/product.schema';
import { PCategoryIDExistenceValidator } from 'src/product-category/custom-validator/pcategory-id-existence.validator';

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

}
