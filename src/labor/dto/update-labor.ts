import { AddLaborDTO } from "./add-labor.dto"
import { PartialType } from "@nestjs/mapped-types"

export class UpdateLaborDTO extends PartialType(AddLaborDTO) {}