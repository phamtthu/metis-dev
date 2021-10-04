import { PartialType } from '@nestjs/mapped-types';
import { AddPCategoryDTO } from './add-product-category.dto';

export class UpdatePCategoryRDTO extends PartialType(AddPCategoryDTO) {}
