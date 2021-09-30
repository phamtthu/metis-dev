import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { SharedService } from '../shared.service';

@Injectable()
export class WorkCenterID implements PipeTransform {

    constructor(
        private sharedService: SharedService
    ) { }

    async transform(workCenterId: any, metadata: ArgumentMetadata) {
        try {
            const result = await this.sharedService.findWOrkCenterById(workCenterId)
            if (!result)
                throw new NotFoundException('Work Center is not exist')
            return workCenterId;
        } catch (error) {
            throw new HttpException({
                status: error.status ?? HttpStatus.BAD_REQUEST,
                error: { message: error.message }
            }, error.status ?? HttpStatus.BAD_REQUEST)
        }

    }
}