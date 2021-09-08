import { UserResponse } from './response/user-reponse';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  HttpService,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserStatus, UserType, ApproveStatus } from './model/user';
import { CreateUserDto } from './dto/create-user.dto';
import { moveTmpToMain, moveSingleTmpToMain, moveTmpToMainObject } from '../shared/helper';
import { ConfigService } from '../config/config.service';
import { FcmPushService } from '../fcm-push/fcm-push.service';
import {
  PushNotificationAllEmployeeDto,
  PushNotificationDto,
} from '../fcm-push/dto/send-notification.dto';

const bcrypt = require('bcrypt');
import axios from 'axios';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<UserDocument>,
    private readonly http: HttpService,
    private readonly configService: ConfigService,
    private readonly fcmPushService: FcmPushService,
  ) {
  }

  async findByPhone(phone: string): Promise<User> {
    const user = await this.userModel.find({ phone: phone }).exec();
    if (user && user.length > 0) {
      return user[0];
    }
    return null;
  }

  async findByFullPhone(phone: string, countryCode: string, dialCode: string) {
    return await this.userModel.findOne({
      phone: phone,
      country_code: countryCode,
      dial_code: dialCode,
    });
  }

  async create(user: CreateUserDto): Promise<any> {
    const existUser = await this.userModel
      .findOne({ phone: user.phone })
      .exec();
    if (existUser) {
      throw new HttpException('USER_IS_EXIST', HttpStatus.BAD_REQUEST);
    }
    user.password = await bcrypt.hash(user.password, 10);
    const newUser = new this.userModel(user);
    newUser.device_token = [];

    return await newUser.save();
  }

  public async update(userId: string, user: UpdateUserDto): Promise<any> {
    user.certicate_image = await moveTmpToMain(user.certicate_image, 'user');
    user.portrait_image = await moveTmpToMainObject(user.portrait_image, 'user');
    user.id_card_image = await moveTmpToMainObject(user.id_card_image, 'user');
    user.avatar = await moveSingleTmpToMain(user.avatar, 'avatar');
    user.approve_status = ApproveStatus.UPDATED;
    const result = await this.userModel.findByIdAndUpdate(userId, user, {
      new: true,
      useFindAndModify: false,
    });
    
    return result;
  }

  public async findById(userId: string): Promise<any> {
    return await this.userModel.findById(userId).exec();
  }

  public async checkUserExist(userId: string, phone: string) {
    if (userId) {
      return await this.userModel.findOne({
        _id: { $ne: userId },
        phone: phone,
      });
    } else {
      return await this.userModel.findOne({ phone: phone });
    }
  }

  public async createChangeCode(userId: string, phoneNumber: string, changeCode) {
    await this.userModel.findByIdAndUpdate(
      userId,
      {
        change_code: changeCode,
        time_change_pass: new Date(),
      },
      { new: true, useFindAndModify: false },
    );

    return await this.callVoiceOTP(phoneNumber, changeCode.toString());
  }

  public async updateChangePass(userId: string, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.userModel.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
        time_change_pass: new Date(),
        change_code: '',
      },
      { new: true, useFindAndModify: false },
    );
  }

  public async findByChangeCodeAndPhone(code: string, phone: string): Promise<User> {
    return await this.userModel.findOne({ change_code: code, phone: phone, status: UserStatus.ACTIVE });
  }

  
  public async updateStar(userId: string, star: number) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      { star: star },
      { new: true, useFindAndModify: false },
    );
  }

  public async getActiveUserByPhone(phone: string): Promise<User> {
    const user = await this.userModel.findOne({
      phone: phone,
      status: UserStatus.ACTIVE,
    });
    if (user) {
      return user;
    }
    throw new HttpException('USER_NOT_EXIST', HttpStatus.BAD_REQUEST);
  }

  public async updateCountConnect(userId: string) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      {
        $inc: { num_connect: 1, today_connect_count: 1 },
        $set: { last_connect: new Date() },
      },
      { new: true, useFindAndModify: false },
    );
  }

  public async updateCountRatting(userId: string) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      { $inc: { num_ratting: 1 } },
      { new: true, useFindAndModify: false },
    );
  }

  public async updateDeviceToken(userId: string, deviceToken: string) {
    try {
      const user = await this.userModel.findById(userId);
      if (user.device_token && user.device_token.length >= 0) {
        const data = user.device_token.some((key) => key == deviceToken)
          ? user.device_token
          : user.device_token.concat(deviceToken);
        return await this.userModel.findByIdAndUpdate(
          userId,
          { device_token: data },
          {
            new: true,
            useFindAndModify: false,
          },
        );
      } else {
        return await this.userModel.findByIdAndUpdate(
          userId,
          { device_token: [deviceToken] },
          {
            new: true,
            useFindAndModify: false,
          },
        );
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async removeDeviceToken(userId: string, deviceToken: string) {
    try {
      const user = await this.userModel.findById(userId);
      const data = user.device_token;
      const removeIndex = data
        .map((item) => {
          return item;
        })
        .indexOf(deviceToken);
      data.splice(removeIndex, 1);
      return await this.userModel.findByIdAndUpdate(
        userId,
        { device_token: data },
        {
          new: true,
          useFindAndModify: false,
        },
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async makeVerifyCode(length) {
    const result = [];
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength)),
      );
    }
    return result.join('');
  }

  public async sendSMSVerify(
    userId: string,
    userPhone: string,
    countryCode: string,
    dialCode: string,
  ) {
    try {
      const verifyCode = await this.makeVerifyCode(6);
      // const verifyCode = '111222';
      const user = await this.userModel.findByIdAndUpdate(
        userId,
        { verify_code: verifyCode },
        {
          new: true,
          useFindAndModify: false,
        },
      );

      if (!user.phone) {
        throw new HttpException(
          'PHONE_NUMBER_NOT_VAILD',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        return await this.callVoiceOTP(user.phone, verifyCode);
      }
      throw new HttpException('UNKNOWNS_ERROR', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async callVoiceOTP(phoneNumber, verifyCode) {
    let numberPhone = phoneNumber;
    if (numberPhone.charAt(0) == '0') {
      numberPhone = numberPhone.substring(1);
    }
    const rs = await axios.post(
      'https://cloudsms4.vietguys.biz:4438/api/index.php',
      {
        from: 'VoiceOTP',
        u: 'tekup',
        pwd: 'yz736',
        phone: '84' + numberPhone,
        sms: 'Mã xác thực skyconnect là: ' + verifyCode,
        type: 8,
        json: 1,
      },
    );

    if (rs && rs.data) {
      return rs.data;
    } else {
      return null;
    }
  }

  public async checkSMSVerify(userId: string, verifyCode: string) {
    try {
      const result = await this.userModel.findOneAndUpdate(
        {
          _id: userId,
          verify_code: verifyCode,
        },
        { verify_sms: true, verify_code: '' },
        {
          new: true,
          useFindAndModify: false,
        },
      );

      if (result) {
        return true;
      }
      return false;
      return verifyCode;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async getActiveUserByFullPhone(
    phone: string,
    countryCode: string,
    dialCode: string,
  ): Promise<User> {
    try {
      const user = await this.userModel.findOne({
        phone: phone,
        country_code: countryCode,
        dial_code: dialCode,
        // status: UserStatus.ACTIVE,
      });
      if (user) {
        if (user.status == UserStatus.INACTIVE) {
          throw new HttpException('USER_NOT_ACTIVE', HttpStatus.BAD_REQUEST);
        } else return user;
      } else {
        throw new HttpException('USER_NOT_EXIST', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async detail(userId: string) {
    try {
      const user = await this.userModel.findById(userId);
      if (user) {
        const response = new UserResponse(user.toJSON());
        return response;
      }
      throw new HttpException('USER_NOT_EXIST', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async resetLimitConnect() {
    try {
      const users = await this.userModel.updateMany(
        {},
        {
          $set: {
            today_connect_count: 0,
            last_connect: new Date('2020-01-01T14:24:04.374+0000'),
          },
        },
        { multi: true },
      );
      console.log('resetLimitConnect', users);
      return users;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async incrementSaveNews(userId: string) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      {
        $inc: { num_save_news: 1 },
      },
      { new: true, useFindAndModify: false },
    );
  }

  public async decrementtSaveNews(userId: string) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      {
        $inc: { num_save_news: -1 },
      },
      { new: true, useFindAndModify: false },
    );
  }
}
