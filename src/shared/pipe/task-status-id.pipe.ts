import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { SharedService } from '../shared.service';

@Injectable()
export class TaskStatusId implements PipeTransform {
  constructor(private sharedService: SharedService) {}

  async transform(taskStatusId: any, metadata: ArgumentMetadata) {
    try {
      const result = await this.sharedService.findTaskStatusById(taskStatusId);
      if (!result) throw new NotFoundException('TaskStatus is not exist');
      return taskStatusId;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status ?? HttpStatus.BAD_REQUEST,
          error: { message: error.message },
        },
        error.status ?? HttpStatus.BAD_REQUEST,
      );
    }
  }
}
