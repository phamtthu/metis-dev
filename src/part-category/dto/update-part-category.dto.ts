import { PartialType } from "@nestjs/mapped-types"
import { AddPCategoryDTO } from "./add-part-category.dto"

export class UpdatePCategoryRDTO extends PartialType(AddPCategoryDTO) {}