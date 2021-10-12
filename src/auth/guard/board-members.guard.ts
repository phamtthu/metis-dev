import {
  ArgumentsHost,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { messageError } from 'src/common/utils/error';
import { AuthService } from '../auth.service';

@Injectable()
export class BoardMemberGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const boardId = request.params.boardId;
      const user = request.user;
      const board = await this.authService.checkBoardMember(boardId, user._id);
      if (board) {
        request.board = board;
        return true;
      } else {
        throw new ForbiddenException(
          "Board is not exist or You don't have right to access this Board",
        );
      }
    } catch (e) {
      messageError(e);
    }
  }
}
