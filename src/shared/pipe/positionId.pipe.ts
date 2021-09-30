import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { SharedService } from '../shared.service';

@Injectable()
export class PositionID implements PipeTransform {

    constructor(
        private sharedService: SharedService
    ) { }

    async transform(positionId: any, metadata: ArgumentMetadata) {
        try {
            const result = await this.sharedService.findPositionById(positionId)
            if (!result)
                throw new NotFoundException('Position is not exist')
            return positionId;
        } catch (error) {
            throw new HttpException({
                status: error.status ?? HttpStatus.BAD_REQUEST,
                error: { message: error.message }
            }, error.status ?? HttpStatus.BAD_REQUEST)
        }
    }
    
}