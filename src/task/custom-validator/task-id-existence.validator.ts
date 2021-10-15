import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { TaskService } from '../task.service';

@ValidatorConstraint({ name: 'TaskExistValidator', async: true })
@Injectable()
export class TaskExistValidator implements ValidatorConstraintInterface {
  constructor(private taskService: TaskService) {}

  async validate(id: string, args: ValidationArguments) {
    try {
      const result = await this.taskService.checkTaskExist(id);
      if (result) return true;
      else return false;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Task ID is not exist';
  }
}
