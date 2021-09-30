import { PartialType } from '@nestjs/mapped-types';
import { AddSequenceDTO } from './add-sequence.dto';

export class UpdateSequenceDTO extends PartialType(AddSequenceDTO) {}
