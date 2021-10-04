import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { throwSrvErr } from 'src/common/utils/error';
import { User } from 'src/model/user/user.shema';
import { UserService } from '../user/user.service';

const bcrypt = require('bcrypt');
require('dotenv').config();

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async adminRegister(admin) {
    try {
      admin.password = await this.bcryptPassword(admin.password);
      await this.userService.adminRegister(admin);
    } catch (e) {
      throwSrvErr(e);
    }
  }

  async bcryptPassword(password) {
    try {
      const salt = await bcrypt.genSalt(10);
      const bcryptPassword = await bcrypt.hash(password, salt);
      return bcryptPassword;
    } catch (e) {
      throwSrvErr(e);
    }
  }

  login(user: User) {
    try {
      const userInfor = { userId: user._id, created_at: Date.now() };
      return {
        email: user.email,
        access_token: this.jwtService.sign(userInfor),
        expires_In: process.env.TIME_EXPIRE,
        is_active: user.is_active,
      };
    } catch (e) {
      throwSrvErr(e);
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const user = await this.userService.findUserByEmail(email);
      if (user && (await bcrypt.compare(pass, user.password))) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (e) {
      throwSrvErr(e);
    }
  }

  async findUserById(userId: string) {
    try {
      return await this.userService.findUserById(userId);
    } catch (e) {
      throwSrvErr(e);
    }
  }
}
