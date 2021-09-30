import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ProductPartService } from '../product-part.service';

@ValidatorConstraint({ name: 'ProductPartIDsExistenceValidator', async: true })
@Injectable()
export class ProductPartIDsExistenceValidator
  implements ValidatorConstraintInterface
{
  constructor(private productPartService: ProductPartService) {}

  async validate(ids: string[], args: ValidationArguments) {
    try {
      if (ids instanceof Array && ids.length === 0) return true;
      else if (ids instanceof Array) {
        if (new Set(ids).size !== ids.length) return false;
        const productPartIds = await this.productPartService.findAllIds();
        return ids.every((val) => productPartIds.includes(val));
      } else {
        const result = await this.productPartService.getDetail(ids);
        if (result) return true;
        else return false;
      }
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'ProductPartID must be exist and do not contain duplicate values';
  }
}
