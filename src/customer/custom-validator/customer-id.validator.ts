import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { CustomerService } from '../customer.service';

@ValidatorConstraint({ name: 'CustomerIdExistenceValidator', async: true })
@Injectable()
export class CustomerIdExistenceValidator
  implements ValidatorConstraintInterface
{
  constructor(private customerService: CustomerService) {}

  async validate(id: string, args: ValidationArguments) {
    try {
      const result = await this.customerService.getDetail(id);
      if (result) return true;
      else return false;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'CustomerId is not exist';
  }
}
