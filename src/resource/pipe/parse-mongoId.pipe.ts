import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseMongodbIdPipe implements PipeTransform {
    transform(value: string, metadata: ArgumentMetadata) {
        try {
            return Types.ObjectId(value)
        } catch (e) { throw new BadRequestException('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters (MongodbId)') }
    }
}