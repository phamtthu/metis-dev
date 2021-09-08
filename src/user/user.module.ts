import { Module, HttpModule } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from './model/user';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationSchema } from './model/location';
import { ConfigModule } from '../config/config.module';
import { FcmPushModule } from '../fcm-push/fcm-push.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'location', schema: LocationSchema }]),
    HttpModule,
    ConfigModule,
    FcmPushModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
