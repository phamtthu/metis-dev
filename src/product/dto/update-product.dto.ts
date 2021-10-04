import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  Validate,
  ValidateNested,
} from 'class-validator';
import { PartIDsExistenceValidator } from 'src/part/custom-validator/part-ids-exitence.validator';
import { AddProductDTO } from './add-product.dto';

export class Part {
  @IsMongoId()
  @Validate(PartIDsExistenceValidator)
  part: string;

  @IsNotEmpty()
  @IsPositive()
  quantity: number;
}

export class UpdateProductDTO extends PartialType(AddProductDTO) {
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Part)
  @ValidateNested({ each: true })
  parts: Part[];
}
