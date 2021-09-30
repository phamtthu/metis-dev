import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { SharedService } from '../shared.service';

@Injectable()
export class ProductCategoryID implements PipeTransform {

    constructor(
        private sharedService: SharedService
    ) { }

    async transform(pCategoryId: any, metadata: ArgumentMetadata) {
        try {
            const result = await this.sharedService.findPCategoryById(pCategoryId)
            if (!result)
                throw new NotFoundException('Product Category is not exist')
            return pCategoryId;
        } catch (error) {
            throw new HttpException({
                status: error.status ?? HttpStatus.BAD_REQUEST,
                error: { message: error.message }
            }, error.status ?? HttpStatus.BAD_REQUEST)
        }

    }
}