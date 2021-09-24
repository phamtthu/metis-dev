import { PartialType } from "@nestjs/mapped-types"
import { AddWorkCenterDTO } from "./add-workcenter.dto"

export class UpdateWorkCenterDTO extends PartialType(AddWorkCenterDTO) { }
