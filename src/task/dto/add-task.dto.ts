import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Validate,
  ValidateIf,
} from 'class-validator';
import { BoardExistValidator } from 'src/board/custom-validator/board-id-existence.validator';
import { TaskGroupExistValidator } from 'src/task-group/custom-validator/task-group-id-existence.validator';

export class AddTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsEnum([1, 2, 3])
  @IsNotEmpty()
  priority: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  description: string;

  @IsNotEmpty()
  plan_start_date: Date;

  @IsNotEmpty()
  plan_end_date: Date;

  /* TODO: Here */
  @IsNotEmpty()
  @IsString()
  @ValidateIf((object, value) => value !== null)
  cover_background: string;

  @IsMongoId()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  @Validate(TaskGroupExistValidator)
  task_group: string;

  @IsMongoId()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  @Validate(BoardExistValidator)
  board: string;

  // @IsMongoId()
  // @IsNotEmpty()
  // @ValidateIf((object, value) => value !== null)
  // // @Validate(TaskStatusIDExistenceValidator)
  // task_group: string;

  // @IsUrl({ require_tld: false }, { each: true })
  // images: string[];

  // @IsNotEmpty()
  // start_date: Date;

  // @IsNotEmpty()
  // end_date: Date;

  // @IsNumber()
  // @IsNotEmpty()
  // plan_start_time: number;

  // @IsNumber()
  // @IsNotEmpty()
  // plan_end_time: number;

  // @IsNumber()
  // @IsNotEmpty()
  // start_time: number;

  // @IsNumber()
  // @IsNotEmpty()
  // end_time: number;

  // @IsNumber()
  // @IsNotEmpty()
  // extra_time: number;

  // @IsNumber()
  // @IsNotEmpty()
  // est_time: number;

  // @IsNumber()
  // @IsNotEmpty()
  // real_time: number;

  // @IsNumber()
  // @Min(0)
  // @Max(100)
  // @IsNotEmpty()
  // percent: number;

  // @IsString()
  // @IsNotEmpty()
  // comment: string;

  // @IsMongoId()
  // @IsNotEmpty()
  // @Validate(SkillIDExistenceValidator)
  // skill: string;

  // @IsMongoId({ each: true })
  // @IsArray()
  // @ArrayNotEmpty()
  // @Validate(LabelIDsExistenceValidator)
  // labels: string[];

  // @IsMongoId()
  // @IsNotEmpty()
  // @ValidateIf((object, value) => value !== null)
  // @Validate(ProductIDExistenceValidator)
  // product: string;

  // @IsMongoId()
  // @IsNotEmpty()
  // @ValidateIf((object, value) => value !== null)
  // @Validate(ProductWorkCenterIDExistenceValidator)
  // product_workcenter: string;

  // @IsMongoId({ each: true })
  // @IsArray()
  // @Validate(UserIDsExistenceValidator)
  // users: string[];

  // // null for Optional
  // @IsMongoId()
  // @ValidateIf((object, value) => value !== null)
  // @Validate(TaskExistValidator)
  // parent: string;

  // @IsMongoId()
  // @ValidateIf((object, value) => value !== null)
  // @Validate(TaskExistValidator)
  // pre_task: string;

  // @IsMongoId()
  // @ValidateIf((object, value) => value !== null)
  // @Validate(TaskExistValidator)
  // after_task: string;
}
