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
export class UserID implements PipeTransform {
  constructor(private sharedService: SharedService) {}

  async transform(userId: any, metadata: ArgumentMetadata) {
    try {
      const result = await this.sharedService.findUserById(userId);
      if (!result) throw new NotFoundException('User is not exist');
      return userId;
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
