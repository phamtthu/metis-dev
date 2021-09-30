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
export class OrderID implements PipeTransform {
  constructor(private sharedService: SharedService) {}

  async transform(orderId: any, metadata: ArgumentMetadata) {
    try {
      const result = await this.sharedService.findOrderById(orderId);
      if (!result) throw new NotFoundException('Order is not exist');
      return orderId;
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
