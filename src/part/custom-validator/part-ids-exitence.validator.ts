import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { PartService } from '../part.service';

@ValidatorConstraint({ name: 'PartIDsExistenceValidator', async: true })
@Injectable()
export class PartIDsExistenceValidator implements ValidatorConstraintInterface {
  constructor(private partService: PartService) {}

  async validate(ids: string[], args: ValidationArguments) {
    try {
      if (ids instanceof Array && ids.length === 0) return true;
      else if (ids instanceof Array) {
        if (new Set(ids).size !== ids.length) return false;
        const partIds = await this.partService.findAllIds();
        return ids.every((val) => partIds.includes(val));
      } else {
        const result = await this.partService.getDetail(ids);
        if (result) return true;
        else return false;
      }
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'PartID must be exist and do not contain duplicate values';
  }
}
