import { Injectable } from "@nestjs/common"
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator"
import { ResourceService } from "../resource.service"

@ValidatorConstraint({ name: "ResourceIDsExistenceValidator", async: true })
@Injectable()
export class ResourceIDsExistenceValidator implements ValidatorConstraintInterface {

    constructor(
        private resourceService: ResourceService,
    ) { }

    async validate(ids: string[], args: ValidationArguments) {
        try {
            if (ids instanceof Array && ids.length === 0)
                return true
            else if (ids instanceof Array) {
                if (new Set(ids).size !== ids.length)
                    return false
                const resourceIds = await this.resourceService.findAllIds()
                return ids.every(val => resourceIds.includes(val))
            } else {
                const result = await this.resourceService.getDetail(ids)
                if (result)
                    return true
                else
                    return false
            }
        } catch (error) { return false }
    }

    defaultMessage(args: ValidationArguments) {
        return "ResourceID must be exist and do not contain duplicate values"
    }
}
