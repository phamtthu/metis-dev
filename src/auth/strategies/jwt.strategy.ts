import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Status } from 'src/common/enum/filter.enum';
import { AuthService } from '../auth.service';
import { throwCntrllrErr } from 'src/common/utils/error';

require('dotenv').config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super({
      // decode JWT
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.authService.findUserById(payload.userId);
      if (!user) throw new UnauthorizedException('User is not exist');
      else if (user && user.is_active === Status.Active) return user;
      // => req.user
      else throw new ForbiddenException('Request denied. User is not active');
    } catch (error) {
      throwCntrllrErr(error);
    }
  }
}
