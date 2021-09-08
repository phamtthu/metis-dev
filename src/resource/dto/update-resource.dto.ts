import { PartialType } from "@nestjs/mapped-types"
import { AddResourceDTO } from "./add-resource.dto"

export class UpdateResourceDTO extends PartialType(AddResourceDTO) { }
