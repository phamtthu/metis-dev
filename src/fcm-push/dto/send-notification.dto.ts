import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  Length,
  IsInt,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { User } from 'src/model/user.shema';

export class PushNotificationDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly user: User;

  notification_title: string;
  notification_body: string;

  data: any;
}

export class PushNotificationAllEmployeeDto {
  notification_title: string;
  notification_body: string;

  data: any;
}
