import { PartialType } from "@nestjs/mapped-types"
import { AddCustomerDTO } from "./add-customer.dto"

export class UpdateCustomerDTO extends PartialType(AddCustomerDTO) {}