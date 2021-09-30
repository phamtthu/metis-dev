import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { throwCntrllrErr } from 'src/common/utils/error';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      const user = await this.authService.validateUser(email, password);
      if (user) {
        return user;
      } else throw new NotFoundException("Email or Password is't right");
      // Passport automatically creates a user object,
      //based on the value we return from the validate() method,
      //and assigns it to the Request object as req.user
    } catch (error) {
      throwCntrllrErr(error);
    }
  }
}
