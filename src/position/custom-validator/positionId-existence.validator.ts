import { Injectable } from "@nestjs/common"
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator"
import { PositionService } from "../position.service"

@ValidatorConstraint({ name: "PositionIDExistenceValidator", async: true })
@Injectable()
export class PositionIDExistenceValidator implements ValidatorConstraintInterface {

    constructor(
        private positionService: PositionService
    ) { }

    async validate(id: string, args: ValidationArguments) {
        try {
            const result = await this.positionService.getDetail(id)
            if (result)
                return true
            else
                return false
        } catch (error) { return false }
    }

    defaultMessage(args: ValidationArguments) {
        return "There is Position that does not exist"
    }
}
