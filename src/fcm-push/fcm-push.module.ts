import { Module } from '@nestjs/common';
import { FcmPushService } from './fcm-push.service';

@Module({
  imports: [],
  // controllers: [ConnectController],
  providers: [FcmPushService],
  exports: [FcmPushService],
})
export class FcmPushModule {}
