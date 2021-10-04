import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Validate,
  ValidateNested,
} from 'class-validator';
import { CustomerIdExistenceValidator } from 'src/customer/custom-validator/customer-id.validator';
import { ProductIDExistenceValidator } from 'src/product/custom-validator/product-id-existence.validator';

export class Product {
  @IsMongoId()
  @Validate(ProductIDExistenceValidator)
  product: string;

  @IsNotEmpty()
  @IsPositive()
  quantity: number;
}

export class AddOrderDTO {
  @IsMongoId()
  @IsNotEmpty()
  @Validate(CustomerIdExistenceValidator)
  customer: string;

  @IsNotEmpty()
  start_date: Date;

  @IsNotEmpty()
  date_scheduled: Date;

  @IsNotEmpty()
  date_fulfilled: Date;

  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Product)
  @ValidateNested({ each: true })
  products: Product[];
}
