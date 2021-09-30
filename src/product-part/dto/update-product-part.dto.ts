import { PartialType } from "@nestjs/mapped-types"
import { AddProductPartDTO } from "./add-product-part.dto"

export class UpdateProductPartDTO extends PartialType(AddProductPartDTO) {}