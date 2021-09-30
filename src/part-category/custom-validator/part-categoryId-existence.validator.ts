import { Injectable } from "@nestjs/common"
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator"
import { PartCategoryService } from "../part-category.service"


@ValidatorConstraint({ name: "PartCategoryIDExistenceValidator", async: true })
@Injectable()
export class PartCategoryIDExistenceValidator implements ValidatorConstraintInterface {

    constructor(
        private partCategoryService: PartCategoryService,
    ) { }

    async validate(id: string, args: ValidationArguments) {
        try {
            const result = await this.partCategoryService.getDetail(id)
            if (result) return true
            else return false
        } catch (error) { return false }
    }

    defaultMessage(args: ValidationArguments) {
        return "There is Part CategoryID that does not exist"
    }

}
