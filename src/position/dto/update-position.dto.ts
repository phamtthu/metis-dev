import { PartialType } from '@nestjs/mapped-types';
import { AddPositionDto } from './add-position.dto';

export class UpdatePositionDto extends PartialType(AddPositionDto) {}
