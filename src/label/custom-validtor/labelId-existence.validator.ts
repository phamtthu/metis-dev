import { Injectable } from "@nestjs/common"
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator"
import { LabelService } from "../label.service"

@ValidatorConstraint({ name: "LabelIDsExistenceValidator", async: true })
@Injectable()
export class LabelIDsExistenceValidator implements ValidatorConstraintInterface {

    constructor(
        private labelService: LabelService
    ) { }

    async validate(ids: string[], args: ValidationArguments) {
        try {
            if (ids instanceof Array && ids.length === 0)
                return true
            else if (ids instanceof Array) {
                if (new Set(ids).size !== ids.length)
                    return false
                const laborIds = await this.labelService.findAllIds()
                return ids.every(val => laborIds.includes(val))
            } else {
                const result = await this.labelService.getDetail(ids)
                if (result)
                    return true
                else
                    return false
            }
        } catch (error) { return false }
    }

    defaultMessage(args: ValidationArguments) {
        return "LabelID must be exist and do not contain duplicate values"
    }
}
