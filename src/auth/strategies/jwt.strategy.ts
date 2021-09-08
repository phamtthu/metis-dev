import { TestingModule } from '@nestjs/testing';
import { AuthService } from './../auth.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { UserStatus } from '../../user/model/user';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: any) {
        const user = await this.authService.findById(payload.id);
        if(user.status == UserStatus.INACTIVE) return false;
        if(payload.user_type == 'ADMIN' || user?.time_change_pass && user?.time_change_pass.getTime() > new Date(payload.login_date).getTime()){
            return false;
        }
        return payload;
    }
}