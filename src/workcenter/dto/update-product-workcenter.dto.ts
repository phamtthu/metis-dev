import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
  Validate,
} from 'class-validator';
import { ProductIDExistenceValidator } from 'src/product/custom-validator/product-id-existence.validator';
import { ResourceIDsExistenceValidator } from 'src/resource/custom-validator/resource-ids-existence-validator';
import { UserIDsExistenceValidator } from 'src/user/custom-validator/user-ids.validator';

export class UpdateProductWorkCenterDTO {
  @IsOptional()
  @IsMongoId()
  @IsNotEmpty()
  @Validate(ProductIDExistenceValidator)
  product: string;

  // Enum Later
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  status: number;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @Validate(UserIDsExistenceValidator)
  users: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @Validate(ResourceIDsExistenceValidator)
  resources: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  percent: number;
}
