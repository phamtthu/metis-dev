import { Injectable } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Validate,
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BoardExistValidator } from 'src/board/custom-validator/board-id-existence.validator';
import { ProductIDExistenceValidator } from 'src/product/custom-validator/product-id-existence.validator';
import { UserIDsExistenceValidator } from 'src/user/custom-validator/user-ids.validator';
import { WorkCenterIDExistenceValidator } from 'src/workcenter/custom-validator/workcenter-id.validator';

@ValidatorConstraint({ name: 'TimeInputValidator', async: false })
@Injectable()
export class TimeInputValidator implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    try {
      const obj: any = args.object;
      if (obj.timeRange && !obj.startDate && !obj.endDate) {
        return true;
      } else if (obj.startDate && obj.endDate && !obj.timeRange) {
        if (new Date(obj.startDate) > new Date(obj.endDate)) return false;
        else return true;
      } else return false;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Time input is not valid';
  }
}

enum OrderValue {
  asc = 1,
  desc = -1,
}

enum TimeRangeValue {
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year',
  all = 'all',
}

export class ReportQueryDto {
  @IsOptional()
  @ValidateIf((object, value) => value !== '')
  @IsNumberString()
  offset: string;

  @IsOptional()
  @ValidateIf((object, value) => value !== '')
  @IsNumberString()
  limit: string;

  @IsOptional()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== '')
  @Transform(({ value }) => {
    console.log(value);
    if (!(value instanceof Array)) {
      return [...new Set(value.split(','))];
    }
    return value;
  })
  @IsMongoId({ each: true })
  @Validate(ProductIDExistenceValidator, { each: true })
  products: string[];

  @IsOptional()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== '')
  @Transform(({ value }) => {
    console.log(value);
    if (!(value instanceof Array)) {
      return [...new Set(value.split(','))];
    }
    return value;
  })
  @IsMongoId({ each: true })
  @Validate(BoardExistValidator, { each: true })
  boards: string[];

  @IsOptional()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== '')
  @Transform(({ value }) => {
    console.log(value);
    if (!(value instanceof Array)) {
      return [...new Set(value.split(','))];
    }
    return value;
  })
  @IsMongoId({ each: true })
  @Validate(WorkCenterIDExistenceValidator, { each: true })
  workcenters: string[];

  @IsOptional()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== '')
  @Transform(({ value }) => {
    console.log(value);
    if (!(value instanceof Array)) {
      return [...new Set(value.split(','))];
    }
    return value;
  })
  @IsMongoId({ each: true })
  @Validate(UserIDsExistenceValidator, { each: true })
  users: string[];

  @IsOptional()
  @Validate(TimeInputValidator)
  @IsEnum(TimeRangeValue)
  timeRange: Date;

  @IsOptional()
  @Validate(TimeInputValidator)
  startDate: Date;

  @IsOptional()
  @Validate(TimeInputValidator)
  endDate: Date;

  @IsNotEmpty()
  @IsEnum(OrderValue)
  order: string;
}
/* 
L???c theo S???n ph???m:
Working Center: L???c theo Workcenter
Board: L???c theo Board
Nh??n vi??n: T??n nh??n vi??n, 
week, day, month, day to day
S???p x???p: M???i nh???t tr??? nh???t.
Th???i gian: l???c theo ng??y h??m nay, l???c theo trong tu???n, l???c theo th??ng n??y, l???c theo kho???ng th???i gian, l???c them n??m, ho???c all the time
*/