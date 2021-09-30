import {
  Controller,
  Get,
  UseGuards,
  HttpStatus,
  Req,
  Post,
  Request,
  HttpException,
  Response,
  Body,
  Query,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { throwCntrllrErr } from 'src/common/utils/error';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/create-admin')
  async adminRegister() {
    try {
      await this.authService.adminRegister({
        email: process.env.email || 'email@email.com',
        password: process.env.password || 'password',
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req, @Response() res) {
    try {
      const result = this.authService.login(req.user);
      return res.status(HttpStatus.OK).json({
        message: `Login successfully`,
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }
}
