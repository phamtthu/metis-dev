import {
    ArrayNotEmpty,
    IsArray,
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsString,
    IsUrl,
    Matches,
    Max,
    MaxLength,
    Min,
    Validate,
    ValidateIf
} from "class-validator"
import { LabelIDsExistenceValidator } from "src/label/custom-validtor/labelId-existence.validator"
import { ProductIDExistenceValidator } from "src/product/custom-validator/productId-existence.validator"
import { SkillIDExistenceValidator } from "src/skill/custom-validator/skillId-existence.validator"
import { TaskStatusIDExistenceValidator } from "src/task-status/custom-validator/taskstatusId-existence.validator"
import { UserIDsExistenceValidator } from "src/user/custom-validator/userIds.validator"
import { TaskIDExistenceValidator } from "../custom-validator/taskId-existence.validator"

export class AddTaskDTO {

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string

    @IsString()
    @IsNotEmpty()
    @Matches(/\b[a-zA-Z]{2}[0-9]{3}\b/, {
        message: 'task_no must follow 2 Letter and 3 Number, Ex: AA000'
    })
    task_no: string

    @IsEnum([1, 2, 3])
    @IsNotEmpty()
    priority: number

    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    description: string

    @IsUrl({ require_tld: false }, { each: true })
    images: string[]

    // @IsUrl({ require_tld: false }, { each: true })
    // files: string[]

    @IsNotEmpty()
    plan_start_date: Date

    @IsNotEmpty()
    plan_end_date: Date

    @IsNotEmpty()
    start_date: Date

    @IsNotEmpty()
    end_date: Date

    @IsNumber()
    @IsNotEmpty()
    plan_start_time: number

    @IsNumber()
    @IsNotEmpty()
    plan_end_time: number

    @IsNumber()
    @IsNotEmpty()
    start_time: number

    @IsNumber()
    @IsNotEmpty()
    end_time: number

    @IsNumber()
    @IsNotEmpty()
    extra_time: number

    @IsNumber()
    @IsNotEmpty()
    est_time: number

    @IsNumber()
    @IsNotEmpty()
    real_time: number

    @IsNumber()
    @Min(0)
    @Max(100)
    @IsNotEmpty()
    percent: number

    @IsString()
    @IsNotEmpty()
    comment: string

    @IsMongoId()
    @IsNotEmpty()
    @Validate(SkillIDExistenceValidator)
    skill: string

    @IsMongoId({ each: true })
    @IsArray()
    @ArrayNotEmpty()
    @Validate(LabelIDsExistenceValidator)
    labels: string[]

    @IsMongoId()
    @IsNotEmpty()
    @ValidateIf((object, value) => value !== null)
    @Validate(TaskStatusIDExistenceValidator)
    status: string

    @IsMongoId()
    @IsNotEmpty()
    @ValidateIf((object, value) => value !== null)
    @Validate(ProductIDExistenceValidator)
    product: string

    @IsMongoId({ each: true })
    @IsArray()
    @Validate(UserIDsExistenceValidator)
    users: string[]

    // null for Optional
    @IsMongoId()
    @ValidateIf((object, value) => value !== null)
    @Validate(TaskIDExistenceValidator)
    parent: string

    @IsMongoId()
    @ValidateIf((object, value) => value !== null)
    @Validate(TaskIDExistenceValidator)
    pre_task: string

    @IsMongoId()
    @ValidateIf((object, value) => value !== null)
    @Validate(TaskIDExistenceValidator)
    after_task: string

}