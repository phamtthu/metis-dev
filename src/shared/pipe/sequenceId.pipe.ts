import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { SharedService } from '../shared.service';

@Injectable()
export class SequenceID implements PipeTransform {

    constructor(
        private sharedService: SharedService
    ) { }

    async transform(sequenceId: any, metadata: ArgumentMetadata) {
        try {
            const result = await this.sharedService.findSequenceById(sequenceId)
            if (!result)
                throw new NotFoundException('Sequence is not exist')
            return sequenceId;
        } catch (error) {
            throw new HttpException({
                status: error.status ?? HttpStatus.BAD_REQUEST,
                error: { message: error.message }
            }, error.status ?? HttpStatus.BAD_REQUEST)
        }
    }
    
}