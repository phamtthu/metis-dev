import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { SharedService } from '../shared.service';

@Injectable()
export class ProcessID implements PipeTransform {

    constructor(
        private sharedService: SharedService
    ) { }

    async transform(processId: any, metadata: ArgumentMetadata) {
        try {
            const result = await this.sharedService.findProcessById(processId)
            if (!result)
                throw new NotFoundException('Process is not exist')
            return processId;
        } catch (error) {
            throw new HttpException({
                status: error.status ?? HttpStatus.BAD_REQUEST,
                error: { message: error.message }
            }, error.status ?? HttpStatus.BAD_REQUEST)
        }
    }
    
}