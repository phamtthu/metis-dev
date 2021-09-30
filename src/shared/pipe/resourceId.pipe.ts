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
export class ResourceID implements PipeTransform {
  constructor(private sharedService: SharedService) {}

  async transform(resourceId: any, metadata: ArgumentMetadata) {
    try {
      const result = await this.sharedService.findResourceById(resourceId);
      if (!result) throw new NotFoundException('Resource is not exist');
      return resourceId;
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
