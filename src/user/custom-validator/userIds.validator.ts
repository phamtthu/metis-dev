import { Injectable } from "@nestjs/common"
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator"
import { UserService } from "../user.service"

@ValidatorConstraint({ name: "UserIDsExistenceValidator", async: true })
@Injectable()
export class UserIDsExistenceValidator implements ValidatorConstraintInterface {

    constructor(
        private userService: UserService,
    ) { }

    async validate(ids: string[], args: ValidationArguments) {
        try {
            if (ids instanceof Array && ids.length === 0)
                return true
            else if (ids instanceof Array) {
                if (new Set(ids).size !== ids.length)
                    return false
                const userIds = await this.userService.findAllIds()
                return ids.every(val => userIds.includes(val))
            } else {
                const result = await this.userService.getDetail(ids)
                if (result)
                    return true
                else
                    return false
            }
        } catch (error) { return false }
    }

    defaultMessage(args: ValidationArguments) {
        return "UserID must be exist and do not contain duplicate values"
    }
}
