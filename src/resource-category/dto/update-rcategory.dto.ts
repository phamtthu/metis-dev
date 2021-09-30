import { PartialType } from '@nestjs/mapped-types';
import { AddRCategoryDTO } from './add-rcategory.dto';

export class UpdateRCategoryRDTO extends PartialType(AddRCategoryDTO) {}
