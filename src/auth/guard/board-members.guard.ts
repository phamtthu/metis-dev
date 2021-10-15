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
      let boardId;
      if (request.params.boardId) {
        boardId = request.params.boardId;
      } else if (request.body.board) {
        boardId = request.body.board;
      } else if (request.params.taskId) {
        const task = await this.authService.findTaskById(request.params.taskId);
        boardId = task.board;
      } else if (request.body.task) {
        const task = await this.authService.findTaskById(request.body.task);
        boardId = task.board;
      } else if (request.params.taskChecklistId) {
        const taskChecklist: any = await this.authService.findTaskChecklistById(
          request.params.taskChecklistId,
        );
        boardId = taskChecklist.task.board;
      } else if (request.params.taskGroupId) {
        const taskGroup = await this.authService.findTaskGroupById(
          request.params.taskGroupId,
        );
        boardId = taskGroup.board;
      } else {
        throw new Error('Can not find Board');
      }
      console.log('BoardID:', boardId);
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
