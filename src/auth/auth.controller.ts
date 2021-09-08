import { LogoutDto } from './dto/logout-dto';
import {
  HttpStatus,
  Controller,
  Body,
  Get,
  Res,
  Post,
  Request,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  SerializeOptions,
  HttpException,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.gaurd';
import { LoginDto } from './dto/login-dto';
import { RegistDto } from './dto/regist-dto';
import { UserResponse } from './dto/user-response-dto';
import { ForgetPassDto } from './dto/forget-pass-dto';
import { ChangePassDto } from './dto/change-pass-dto';
import { TokenVerifyDto } from '../user/dto/token-verify.dto';

@Controller()
export class AuthController {

  constructor(private readonly authService: AuthService) {
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/api/auth/login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/api/auth/regist')
  async regist(@Body() registDto: RegistDto): Promise<UserResponse> {
    return await this.authService.regist(registDto);

  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/api/auth/verify')
  public async verifyToken(@Request() req, @Query() tokenVerifyDto: TokenVerifyDto): Promise<any> {
    try {
      return await this.authService.verifyToken(tokenVerifyDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('/api/profile')
  async getProfile(@Request() req): Promise<any> {
    try {
      const user = await this.authService.findById(req.user.id);
      return new UserResponse(user.toJSON());
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return req.user;
  }

  @Post('/api/auth/forget')
  async forget(@Body() forgetPassDto: ForgetPassDto): Promise<any> {
    try {
      const sms = await this.authService.forgetPass(forgetPassDto);
      if (sms.error != 0) {
        throw new HttpException(sms.log, HttpStatus.BAD_REQUEST);
      }
      return {
        message: 'CHANGE_CODE_WAS_SEND',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/api/auth/update-pass')
  async updatePass(@Body() changePassDto: ChangePassDto): Promise<any> {
    try {
      await this.authService.updatePass(changePassDto);
      return {
        message: 'PASSWORD_CHANGE_SUCCESS',
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/api/auth/logout')
  async logout(@Request() req, @Body() logoutDto: LogoutDto) {
    return await this.authService.logout(req.user.id, logoutDto);
  }

}
