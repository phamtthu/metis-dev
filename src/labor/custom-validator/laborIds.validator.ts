import { Injectable } from "@nestjs/common"
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator"
import { LaborService } from "../labor.service"

@ValidatorConstraint({ name: "LaborIDsExistenceValidator", async: true })
@Injectable()
export class LaborIDsExistenceValidator implements ValidatorConstraintInterface {

    constructor(
        private laborService: LaborService,
    ) { }

    async validate(ids: string[], args: ValidationArguments) {
        try {
            if (ids instanceof Array && ids.length === 0)
                return true
            else if (ids instanceof Array) {
                if (new Set(ids).size !== ids.length)
                    return false
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
        return "LaborID must be exist and do not contain duplicate values"
    }
}
