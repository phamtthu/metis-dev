import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { SequenceService } from '../sequence.service';

@ValidatorConstraint({ name: 'SequenceIDExistenceValidator', async: true })
@Injectable()
export class SequenceIDExistenceValidator
  implements ValidatorConstraintInterface
{
  constructor(private sequenceService: SequenceService) {}

  async validate(id: string, args: ValidationArguments) {
    try {
      const result = await this.sequenceService.getDetail(id);
      if (result) return true;
      else return false;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'SequenceID is not exist';
  }
}
