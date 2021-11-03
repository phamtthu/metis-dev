import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from 'src/common/enum/filter.enum';
import { messageError } from 'src/common/utils/error';
import { AuthService } from '../auth.service';

@Injectable()
export class BoardMemberGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      // Ignore Admin
      let boardId;
      let task;
      let taskChecklist;
      let taskGroup;
      let label;
      let attachment: any;
      let item;
      switch (true) {
        case request.params.boardId != null:
          boardId = request.params.boardId;
          break;
        case request.body.board != null:
          boardId = request.body.board;
          break;
        case request.params.taskId != null:
          task = await this.authService.findTaskById(request.params.taskId);
          boardId = task.board;
          break;
        case request.body.task != null:
          task = await this.authService.findTaskById(request.body.task);
          boardId = task.board;
          break;
        case request.params.taskChecklistId != null:
          taskChecklist = await this.authService.findTaskChecklistById(
            request.params.taskChecklistId,
          );
          boardId = taskChecklist.task.board;
          break;
        case request.params.taskGroupId != null:
          taskGroup = await this.authService.findTaskGroupById(
            request.params.taskGroupId,
          );
          boardId = taskGroup.board;
          break;
        case request.params.labelId != null:
          label = await this.authService.findLabelById(request.params.labelId);
          boardId = label.board;
          break;
        case request.params.attachmentId != null:
          attachment = await this.authService.findAttachmentById(
            request.params.attachmentId,
          );
          boardId = attachment.task?.board;
          break;
        case request.body.task_checklist != null:
          taskChecklist = await this.authService.findTaskChecklistById(
            request.body.task_checklist,
          );
          boardId = taskChecklist.task.board;
          break;
        case request.params.itemId != null:
          item = await this.authService.findItemById(request.params.itemId);
          task = await this.authService.findTaskById(item.task_checklist.task);
          boardId = task.board;
          break;
        default:
          throw new Error('Can not find Board');
      }
      const user = request.user;
      if (request?.user?.roles.includes(Role.Admin)) {
        request.board = await this.authService.findBoardById(boardId);
        return true;
      }
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
