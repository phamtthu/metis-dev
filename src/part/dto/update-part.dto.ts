import { PartialType } from '@nestjs/mapped-types';
import { AddPartDTO } from './add-part.dto';

export class UpdatePartDTO extends PartialType(AddPartDTO) {}
