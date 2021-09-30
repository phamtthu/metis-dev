import { PartialType } from '@nestjs/mapped-types';
import { AddPositionDTO } from './add-position.dto';

export class UpdatePositionDTO extends PartialType(AddPositionDTO) {}
