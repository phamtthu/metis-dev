import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ProductWorkCenterService } from '../product-workcenter.service';

@ValidatorConstraint({
  name: 'ProductWorkCenterIDExistenceValidator',
  async: true,
})
@Injectable()
export class ProductWorkCenterIDExistenceValidator
  implements ValidatorConstraintInterface
{
  constructor(private productWorkCenterService: ProductWorkCenterService) {}

  async validate(id: string, args: ValidationArguments) {
    try {
      const result = await this.productWorkCenterService.findProductWCById(id);
      if (result) return true;
      else return false;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Product WorkCenter ID is not exist';
  }
}
