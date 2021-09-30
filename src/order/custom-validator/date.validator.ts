import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'DateValidator', async: false })
@Injectable()
export class DateValidator implements ValidatorConstraintInterface {
  async validate(date: string, args: ValidationArguments) {
    try {
      // yyyy-mm-dd regex
      const regex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/i;
      const result = date.match(regex);
      if (result) return true;
      else return false;
    } catch (err) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Date must follow form yyyy-mm-dd';
  }
}
