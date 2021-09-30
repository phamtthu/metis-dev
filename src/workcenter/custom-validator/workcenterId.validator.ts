import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { WorkCenterService } from '../workcenter.service';

@ValidatorConstraint({ name: 'WorkCenterIDExistenceValidator', async: true })
@Injectable()
export class WorkCenterIDExistenceValidator
  implements ValidatorConstraintInterface
{
  constructor(private workCenterService: WorkCenterService) {}

  async validate(id: string, args: ValidationArguments) {
    try {
      const result = await this.workCenterService.getDetail(id);
      if (result) return true;
      else return false;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Work CenterID is not exist';
  }
}
