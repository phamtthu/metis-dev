import { Injectable } from "@nestjs/common"
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator"
import { LaborService } from "../labor.service"

@ValidatorConstraint({ name: "LaborIDsExistenceValidate", async: true })
@Injectable()
export class LaborIDsExistenceValidator implements ValidatorConstraintInterface {

    constructor(
        private laborService: LaborService,
    ) { }

    async validate(ids: string[], args: ValidationArguments) {
        try {
            console.log(this.laborService)
            if (ids instanceof Array && ids.length === 0)
                return true
            else if (ids instanceof Array) {
                const laborIds = await this.laborService.findAllIds()
                return ids.every(val => laborIds.includes(val))
            } else {
                const result = await this.laborService.getDetail(ids)
                if (result)
                    return true
                else
                    return false
            }
        } catch (error) { return false }
    }

    defaultMessage(args: ValidationArguments) {
        return "There is LaborID that does not exist."
    }
}
