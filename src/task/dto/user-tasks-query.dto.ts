import { IsMongoId, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { WorkCenterIDExistenceValidator } from 'src/workcenter/custom-validator/workcenter-id.validator';

export class UserTasksQueryDto {
  @IsOptional()
  @IsMongoId()
  @IsNotEmpty()
  @Validate(WorkCenterIDExistenceValidator)
  workcenter: string;
}
