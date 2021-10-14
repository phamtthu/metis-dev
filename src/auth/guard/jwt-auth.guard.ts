import {
  Injectable,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { messageError } from 'src/common/utils/error';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (info instanceof Error) {
      messageError({ status: HttpStatus.UNAUTHORIZED, message: info.message });
    }
    return super.handleRequest(err, user, info, context, status);
  }
}
