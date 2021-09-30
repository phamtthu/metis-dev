import { PartialType } from "@nestjs/mapped-types"
import { AddOrderDTO } from "./add-order.dto"

export class UpdateOrderDTO extends PartialType(AddOrderDTO) {}