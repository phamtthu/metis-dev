import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { SharedService } from '../shared.service';

@Injectable()
export class TaskID implements PipeTransform {

    constructor(
        private sharedService: SharedService
    ) { }

    async transform(taksId: any, metadata: ArgumentMetadata) {
        try {
            const result = await this.sharedService.findTaskById(taksId)
            if (!result)
                throw new NotFoundException('Task is not exist')
            return taksId
        } catch (error) {
            throw new HttpException({
                status: error.status ?? HttpStatus.BAD_REQUEST,
                error: { message: error.message }
            }, error.status ?? HttpStatus.BAD_REQUEST)
        }

    }
}