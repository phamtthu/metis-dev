import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { SharedService } from '../shared.service';

@Injectable()
export class CustomerID implements PipeTransform {

    constructor(
        private sharedService: SharedService
    ) { }

    async transform(customerId: any, metadata: ArgumentMetadata) {
        try {
            const result = await this.sharedService.findCustomerById(customerId)
            if (!result)
                throw new NotFoundException('Customer is not exist')
            return customerId;
        } catch (error) {
            throw new HttpException({
                status: error.status ?? HttpStatus.BAD_REQUEST,
                error: { message: error.message }
            }, error.status ?? HttpStatus.BAD_REQUEST)
        }
    }
    
}