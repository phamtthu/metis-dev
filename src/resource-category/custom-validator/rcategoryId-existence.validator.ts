import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ResourceCategoryService } from '../resource-category.service';

@ValidatorConstraint({ name: 'RCategoryIDExistenceValidator', async: true })
@Injectable()
export class RCategoryIDExistenceValidator
  implements ValidatorConstraintInterface
{
  constructor(private rCategoryService: ResourceCategoryService) {}

  async validate(id: string, args: ValidationArguments) {
    try {
      const result = await this.rCategoryService.getDetail(id);
      if (result) return true;
      else return false;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'There is Resource CategoryID that does not exist';
  }
}
