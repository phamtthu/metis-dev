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
export class ResourceCategoryID implements PipeTransform {
  constructor(private sharedService: SharedService) {}

  async transform(rCategoryId: any, metadata: ArgumentMetadata) {
    try {
      const result = await this.sharedService.findRCategoryById(rCategoryId);
      if (!result)
        throw new NotFoundException('Resource Category is not exist');
      return rCategoryId;
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
