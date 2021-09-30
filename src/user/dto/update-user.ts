import { AddUserDTO } from "./add-user.dto"
import { PartialType } from "@nestjs/mapped-types"

export class UpdateUserDTO extends PartialType(AddUserDTO) { }