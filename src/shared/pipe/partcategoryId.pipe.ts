import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { SharedService } from '../shared.service';

@Injectable()
export class PartCategoryID implements PipeTransform {

    constructor(
        private sharedService: SharedService
    ) { }

    async transform(partId: any, metadata: ArgumentMetadata) {
        try {
            const result = await this.sharedService.findPartCategoryById(partId)
            if (!result)
                throw new NotFoundException('PartCategory is not exist')
            return partId;
        } catch (error) {
            throw new HttpException({
                status: error.status ?? HttpStatus.BAD_REQUEST,
                error: { message: error.message }
            }, error.status ?? HttpStatus.BAD_REQUEST)
        }
    }
    
}