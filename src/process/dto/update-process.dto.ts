import { PartialType } from "@nestjs/mapped-types"
import { AddProcessDTO } from "./add-process.dto"

export class UpdateProcessDTO extends PartialType(AddProcessDTO) {}