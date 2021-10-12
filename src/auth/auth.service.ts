import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { errorException } from 'src/common/utils/error';
import { User } from 'src/model/user/user.shema';
import { ProductWorkCenterService } from 'src/product-workcenter/product-workcenter.service';
import { bcryptPassword } from 'src/shared/helper';
import { UserService } from '../user/user.service';

const bcrypt = require('bcrypt');
require('dotenv').config();

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private productWCService: ProductWorkCenterService,
  ) {}

  async adminRegister(admin) {
    try {
      admin.password = await bcryptPassword(admin.password);
      await this.userService.adminRegister(admin);
    } catch (e) {
      errorException(e);
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
      errorException(e);
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
      errorException(e);
    }
  }

  async findUserById(userId: string) {
    try {
      return await this.userService.findUserById(userId);
    } catch (e) {
      errorException(e);
    }
  }

  async checkBoardMember(boardId: string, userId: string) {
    try {
      return await this.productWCService.checkBoardMember(boardId, userId);
    } catch (e) {
      errorException(e);
    }
  }
}
