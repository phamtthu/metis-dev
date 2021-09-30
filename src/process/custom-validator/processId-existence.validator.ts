import { Injectable } from "@nestjs/common"
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator"
import { ProcessService } from "../process.service"

@ValidatorConstraint({ name: "ProcessIDExistenceValidator", async: true })
@Injectable()
export class ProcessIDExistenceValidator implements ValidatorConstraintInterface {

    constructor(
        private processService: ProcessService,
    ) { }

    async validate(id: string, args: ValidationArguments) {
        try {
            const result = await this.processService.getDetail(id)
            if (result)
                return true
            else
                return false
        } catch (error) { return false }
    }

    defaultMessage(args: ValidationArguments) {
        return "ProcessID is not exist"
    }
}
