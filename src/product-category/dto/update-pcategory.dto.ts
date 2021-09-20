import { PartialType } from "@nestjs/mapped-types"
import { AddPCategoryDTO } from "./add-pcategory.dto"

export class UpdatePCategoryRDTO extends PartialType(AddPCategoryDTO) {}