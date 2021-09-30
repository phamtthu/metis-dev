import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ProductService } from '../product.service';

@ValidatorConstraint({ name: 'ProductIDExistenceValidator', async: true })
@Injectable()
export class ProductIDExistenceValidator
  implements ValidatorConstraintInterface
{
  constructor(private productService: ProductService) {}

  async validate(id: string, args: ValidationArguments) {
    try {
      const result = await this.productService.getDetail(id);
      if (result) return true;
      else return false;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'There is Product that does not exist.';
  }
}
