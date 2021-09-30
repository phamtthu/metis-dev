import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { SharedService } from '../shared.service';

@Injectable()
export class LabelID implements PipeTransform {

    constructor(
        private sharedService: SharedService
    ) { }

    async transform(labelId: any, metadata: ArgumentMetadata) {
        try {
            const result = await this.sharedService.findLabelById(labelId)
            if (!result)
                throw new NotFoundException('Label is not exist')
            return labelId;
        } catch (error) {
            throw new HttpException({
                status: error.status ?? HttpStatus.BAD_REQUEST,
                error: { message: error.message }
            }, error.status ?? HttpStatus.BAD_REQUEST)
        }
    }
    
}