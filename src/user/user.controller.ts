import { CheckUserDto } from './dto/check-user.dto';
import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Body,
  Post,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  HttpCode,
  Req,
  Param, Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponse } from './response/user-reponse';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.gaurd';
import { ChangePassDto } from './dto/change-pass.dto';
import { SmsVerifyDto } from './dto/sms-verify.dto';
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('/api/user/update')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Request() req,
    @Body() updateUserData: UpdateUserDto,
  ): Promise<any> {
    try {
      const currentUser = req.user;
      // Check user exist
      const check = await this.userService.checkUserExist(
        currentUser.id,
        updateUserData.phone,
      );
      if (check) {
        throw new HttpException(
          'Phone number is exists!',
          HttpStatus.BAD_REQUEST,
        );
      }
      const user = await this.userService.update(
        currentUser.id,
        updateUserData,
      );
      if (user) {
        const userResponse = new UserResponse(user.toJSON());
        return userResponse;
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'UPDATE_USER_SUCCESS',
        };
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('/api/user/profile')
  public async profile(@Request() req): Promise<any> {
    try {
      const currentUser = req.user;

      const user = await this.userService.findById(currentUser.id);
      if (user) {
        const userResponse = new UserResponse(user.toJSON());
        return userResponse;
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'USER_IS_NOT_EXIST',
        };
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('/api/user/verify-sms')
  public async sendSMSVerify(@Request() req): Promise<any> {
    try {
      const currentUser = req.user;
      const user = await this.userService.findById(currentUser.id);
      if (user.verify_sms == true) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'USER_WAS_VERIFIED',
        };
      } else {
        const sms = await this.userService.sendSMSVerify(
          user._id,
          user.phone,
          user.countryCode,
          user.dialCode,
        );
        if (sms.error != 0) {
          throw new HttpException(sms.log, HttpStatus.BAD_REQUEST);
        }
        return {
          message: 'VERIFY_CODE_WAS_SEND',
        };
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/api/user/verify-sms')
  public async checkSMSVerify(
    @Body() smsVerifyDto: SmsVerifyDto,
    @Request() req,
  ): Promise<any> {
    try {
      const currentUser = req.user;
      const user = await this.userService.findById(currentUser.id);
      const result = await this.userService.checkSMSVerify(
        currentUser.id,
        smsVerifyDto.verify_code,
      );
      if (result) {
        return {
          message: 'VERIFY_SUCCESSED',
        };
      }
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'VERIFY_FAILED',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/api/user/change-password')
  public async changePass(
    @Body() changePassDto: ChangePassDto,
    @Request() req,
  ): Promise<any> {
    try {
      const currentUser = req.user;
      await this.userService.updateChangePass(
        currentUser.id,
        changePassDto.password,
      );
      return {
        message: 'CHANGEPASS_SUCCESS',
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/api/user/check-user')
  @HttpCode(HttpStatus.OK)
  public async checkUser(@Body() checkUserDto: CheckUserDto): Promise<any> {
    try {
      const user = await this.userService.findByPhone(checkUserDto.phone);
      if (user) {
        return {
          status: HttpStatus.OK,
          message: 'USER_IS_EXIST',
        };
      }
      throw new HttpException('USER_NOT_EXIST', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/api/user/detail/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  public async userDetail(@Param('id') userId: string) {
    return this.userService.detail(userId);
  }
}
