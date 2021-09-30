import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { SharedService } from '../shared.service';

@Injectable()
export class ProductPartID implements PipeTransform {

    constructor(
        private sharedService: SharedService
    ) { }

    async transform(productPartId: any, metadata: ArgumentMetadata) {
        try {
            const result = await this.sharedService.findProductPartById(productPartId)
            if (!result)
                throw new NotFoundException('ProductPart is not exist')
            return productPartId;
        } catch (error) {
            throw new HttpException({
                status: error.status ?? HttpStatus.BAD_REQUEST,
                error: { message: error.message }
            }, error.status ?? HttpStatus.BAD_REQUEST)
        }
    }
    
}