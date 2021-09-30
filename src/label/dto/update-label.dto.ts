import { PartialType } from '@nestjs/mapped-types';
import { AddLabelDTO } from './add-label.dto';

export class UpdateLabelDTO extends PartialType(AddLabelDTO) {}
