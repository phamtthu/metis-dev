import { PartialType } from '@nestjs/mapped-types';
import { AddRCategoryDTO } from './add-resource-category.dto';

export class UpdateRCategoryRDTO extends PartialType(AddRCategoryDTO) {}
