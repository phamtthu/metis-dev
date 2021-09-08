import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PushNotificationAllEmployeeDto, PushNotificationDto } from './dto/send-notification.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class FcmPushService {
  constructor() {
  }

  async sendToOneUser(sendNotificationDto: PushNotificationDto): Promise<any> {
    try {
      const user = sendNotificationDto.user;
      let pushResult: any;
      if (
        user.device_token != undefined &&
        user.device_token != null &&
        typeof user.device_token == 'object'
      ) {
        // Check field device token not null || undefined
        if (user.device_token && user.device_token.length > 0) {
          console.log('PREPARE_CALL_PUSH_FCM', 'user', user.name, user._id, 'device_token', user.device_token);
          // Remove all device token not vaild
          const arrayDeviceToken = [];
          for (let i = 0; i < user.device_token.length; i++) {
            if (
              user.device_token[i] != null &&
              user.device_token[i] != '' &&
              user.device_token[i].length > 0
            ) {
              arrayDeviceToken.push(user.device_token[i]);
            }
          }

          // If array device token vaild has length > 0
          if (arrayDeviceToken.length > 0) {
            const payload = {
              notification: {
                title: sendNotificationDto.notification_title,
                body: sendNotificationDto.notification_body,
              },
            } as any;
            if (sendNotificationDto.data) {
              payload.data = sendNotificationDto.data;
            }
            console.log('FCM payload to user', arrayDeviceToken, payload);
            pushResult = await admin
              .messaging()
              .sendToDevice(arrayDeviceToken, payload);
            console.log('FCM result log to user', pushResult);
            if (pushResult['results'] && pushResult['results'].length > 0) {
              for (let _i = 0; _i < pushResult['results'].length; _i++) {
                if (pushResult['results'][_i]['error']) {
                  console.log(pushResult['results'][_i]['error']);
                }
              }
            }
          } else {
            console.log('NO_CALL_PUSH_FCM_TO_DEVICES', 'user', user.name, user._id, 'device_token', user.device_token, 'arrayDeviceToken', arrayDeviceToken);
          }
        } else {
          console.log('NO_CALL_PUSH_FCM_TO_DEVICES', 'user', user.name, user._id, 'device_token', user.device_token);
        }
      } else {
        console.log('NO_CALL_PUSH_FCM_TO_DEVICES', 'user', user.name, user._id, 'device_token', user.device_token);
      }
      return pushResult;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async sendToMultiUser(
    sendNotificationDtos: Array<PushNotificationDto>,
  ): Promise<any> {
    try {
      for (let i = 0; i < sendNotificationDtos.length; i++) {
        this.sendToOneUser(sendNotificationDtos[i]);
      }
      return {};
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
