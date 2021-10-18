import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { TaskStatusService } from '../task-status.service';

@ValidatorConstraint({ name: 'TaskStatusExistValidator', async: true })
@Injectable()
export class TaskStatusExistValidator implements ValidatorConstraintInterface {
  constructor(private taskStatusService: TaskStatusService) {}

  async validate(id: string, args: ValidationArguments) {
    try {
      const result = await this.taskStatusService.getDetail(id);
      if (result) return true;
      else return false;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Task Status ID is not exist';
  }
}
