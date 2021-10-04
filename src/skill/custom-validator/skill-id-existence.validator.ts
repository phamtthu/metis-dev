import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { SkillService } from '../skill.service';

@ValidatorConstraint({ name: 'SkillIDExistenceValidator', async: true })
@Injectable()
export class SkillIDExistenceValidator implements ValidatorConstraintInterface {
  constructor(private skillService: SkillService) {}

  async validate(id: string, args: ValidationArguments) {
    try {
      const result = await this.skillService.getDetail(id);
      if (result) return true;
      else return false;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Skill ID is not exist.';
  }
}
