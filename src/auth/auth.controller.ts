import {
  Controller,
  Get,
  UseGuards,
  Post,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { messageError } from 'src/common/utils/error';
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
      messageError(error);
    }
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req) {
    try {
      const result = this.authService.login(req.user);
      return {
        message: `Login successfully`,
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }
}
