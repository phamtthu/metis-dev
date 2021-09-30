import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsPositive,
  IsString,
  Matches,
  Validate,
  ValidateNested,
} from 'class-validator';
import { CustomerIDExistenceValidator } from 'src/customer/custom-validator/customerId.validator';
import { ProductIDExistenceValidator } from 'src/product/custom-validator/productId-existence.validator';

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
  @Validate(CustomerIDExistenceValidator)
  customer: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\b[a-zA-Z]{2}[0-9]{3}\b/, {
    message: 'po_no must follow 2 Letter and 3 Number, Ex: AA000',
  })
  po_no: string;

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
