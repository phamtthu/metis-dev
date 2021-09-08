import { LogoutDto } from './dto/logout-dto';
import { ChangePassDto } from './dto/change-pass-dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login-dto';
import { RegistDto } from './dto/regist-dto';
import { UserResponse } from './dto/user-response-dto';
import { ForgetPassDto } from './dto/forget-pass-dto';
import { TokenVerifyDto } from '../user/dto/token-verify.dto';
import { UserStatus } from '../user/model/user';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
  }

  async validateUser(phone: string, countryCode: string, dialCode: string, pass: string): Promise<any> {
    const user = await this.userService.getActiveUserByFullPhone(phone, countryCode, dialCode);
    const isEqual = await bcrypt.compare(pass, user?.password);
    return isEqual ? user : false;
  }

  async login(loginDto: LoginDto): Promise<any> {
    try {
      loginDto.phone = loginDto.phone.replace(/^0+/, '');
      const user = await this.validateUser(loginDto.phone, loginDto.country_code, loginDto.dial_code, loginDto.password);
      if (user && user.user_type == loginDto.user_type) {
        const payload = {
          'id': user._id,
          'name': user.name,
          'phone': user.phone,
          'user_type': user.user_type,
          'login_date': new Date(),
        };
        const accessToken = this.jwtService.sign(payload);
        let userResponse = new UserResponse(user.toJSON());
        userResponse.access_token = accessToken;
        if (loginDto?.device_token) {
          await this.userService.updateDeviceToken(user._id, loginDto?.device_token);
        }
        return userResponse;
      } else {
        throw new HttpException('UNAUTHORIZED', HttpStatus.BAD_REQUEST);
      }

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async regist(registDto: RegistDto): Promise<any> {
    try {
      registDto.phone = registDto.phone.replace(/^0+/, '');
      const user = await this.userService.create(registDto);
      if (user) {
        const payload = {
          'id': user._id,
          'name': user.name,
          'phone': user.phone,
          'user_type': user.user_type,
          'login_date': new Date(),
        };
        const accessToken = this.jwtService.sign(payload);
        let userResponse = new UserResponse(user.toJSON());
        userResponse.access_token = accessToken;
        if (registDto?.device_token) {
          this.userService.updateDeviceToken(user._id, registDto?.device_token);
        }

        return userResponse;
      } else {
        throw new HttpException('REGIST_NOT_SUCCESS', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async verifyToken(tokenVerifyDto: TokenVerifyDto): Promise<any> {
    try {
      const user = await this.jwtService.decode(tokenVerifyDto.token) as any;
      const data = {
        user: { id: user.id, login: user.phone, fill_name: user.name },
      };
      return data;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async findById(userId: string): Promise<any> {
    return await this.userService.findById(userId);
  }

  public async forgetPass(forgetPassDto: ForgetPassDto): Promise<any> {
    forgetPassDto.phone = forgetPassDto.phone.replace(/^0+/, '');
    const user = await this.userService.checkUserExist('', forgetPassDto.phone);
    if (user) {
      // const code = Math.random().toString(36).substr(2, 6);
      if (user.status == UserStatus.INACTIVE) {
        throw new HttpException('USER_NOT_ACTIVE', HttpStatus.BAD_REQUEST);
      }
      const code = await this.userService.makeVerifyCode(6);
      return await this.userService.createChangeCode(user.id, user.phone, code);
    } else {
      throw new HttpException('USER_NOT_EXIST', HttpStatus.BAD_REQUEST);
    }
  }

  public async updatePass(changePassDto: ChangePassDto): Promise<any> {
    changePassDto.phone = changePassDto.phone.replace(/^0+/, '');
    const user = await this.userService.findByChangeCodeAndPhone(changePassDto.change_code, changePassDto.phone);
    if (user) {
      return await this.userService.updateChangePass(user._id.toString(), changePassDto.password);
    }
    throw new HttpException('USER_NOT_EXIST', HttpStatus.BAD_REQUEST);
  }

  public async logout(userId, logoutDto: LogoutDto) {
    try {
      this.userService.removeDeviceToken(userId, logoutDto?.device_token);
      return {
        status: HttpStatus.OK,
        message: 'LOGOUT_SUCCESS',
      };

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
