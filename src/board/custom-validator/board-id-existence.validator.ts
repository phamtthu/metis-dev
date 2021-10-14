import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { BoardService } from '../board.service';

@ValidatorConstraint({ name: 'BoardIDExistenceValidator', async: true })
@Injectable()
export class BoardIDExistenceValidator implements ValidatorConstraintInterface {
  constructor(private taskStatusService: BoardService) {}

  async validate(id: string, args: ValidationArguments) {
    try {
      const result = await this.taskStatusService.findBoardById(id);
      if (result) return true;
      else return false;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Board ID is not exist';
  }
}
