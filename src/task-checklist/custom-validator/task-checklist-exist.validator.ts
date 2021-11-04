import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { TaskChecklistService } from '../task-checklist.service';

@ValidatorConstraint({ name: 'TaskChecklistExistValidator', async: true })
@Injectable()
export class TaskChecklistExistValidator
  implements ValidatorConstraintInterface
{
  constructor(private taskChecklistService: TaskChecklistService) {}

  async validate(id: string, args: ValidationArguments) {
    try {
      const result = await this.taskChecklistService.findTaskChecklistById(id);
      if (result) return true;
      else return false;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Task Checklist ID is not exist';
  }
}
