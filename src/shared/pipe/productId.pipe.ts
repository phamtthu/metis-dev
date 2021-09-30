import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { SharedService } from '../shared.service';

@Injectable()
export class ProductID implements PipeTransform {

    constructor(
        private sharedService: SharedService
    ) { }

    async transform(productId: any, metadata: ArgumentMetadata) {
        try {
            const result = await this.sharedService.findProductById(productId)
            if (!result)
                throw new NotFoundException('Product is not exist')
            return productId;
        } catch (error) {
            throw new HttpException({
                status: error.status ?? HttpStatus.BAD_REQUEST,
                error: { message: error.message }
            }, error.status ?? HttpStatus.BAD_REQUEST)
        }
    }
    
}