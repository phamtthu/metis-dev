import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { TaskGroupService } from '../task-group.service';

@ValidatorConstraint({ name: 'TaskGroupExistValidator', async: true })
@Injectable()
export class TaskGroupExistValidator implements ValidatorConstraintInterface {
  constructor(private taskStatusService: TaskGroupService) {}

  async validate(id: string, args: ValidationArguments) {
    try {
      const result = await this.taskStatusService.findTaskGroupById(id);
      if (result) return true;
      else return false;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Task Group ID is not exist';
  }
}
