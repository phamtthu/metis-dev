import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ProductCategoryService } from '../product-category.service';

@ValidatorConstraint({ name: 'PCategoryIDExistenceValidator', async: true })
@Injectable()
export class PCategoryIDExistenceValidator
  implements ValidatorConstraintInterface
{
  constructor(private pCategoryService: ProductCategoryService) {}

  async validate(id: string, args: ValidationArguments) {
    try {
      const result = await this.pCategoryService.getDetail(id);
      if (result) return true;
      else return false;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Product CategoryID is not exist';
  }
}
