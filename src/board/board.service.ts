import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { classToPlain } from 'class-transformer';
import { Model, PaginateModel } from 'mongoose';
import { errorException } from 'src/common/utils/error';
import { Board } from 'src/model/board/board-schema';
import { ProductWorkCenter } from 'src/model/product-workcenter/product-workcenter.schema';
import { Task } from 'src/model/task/task.schema';
import { TaskGroup } from 'src/model/task_group/task-group.schema';
import { generateRandomCode, paginator, toJsObject } from 'src/shared/helper';
import { UpdateBoardDTO } from './dto/update-board.dto';
import { TaskUser } from 'src/model/task-user/taskuser.schema';
import { User } from 'src/model/user/user.shema';
import { Label } from 'src/model/label/label.schema';
import { TaskChecklist } from 'src/model/task-checklist/task-checklist.schema';
import { BoardDetailResponse } from './response/board-detail-response';
import { BoardResponse } from './response/board-response';
import { BoardsResponse } from './response/boards-response';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel('Board')
    private boardModel: PaginateModel<Board>,
    @InjectModel('Product_WorkCenter')
    private productWorkCenterModel: PaginateModel<ProductWorkCenter>,
    @InjectModel('Task')
    private taskModel: PaginateModel<Task>,
    @InjectModel('Task_Group')
    private taskGroupModel: PaginateModel<TaskGroup>,
    @InjectModel('Task_User')
    private taskUserModel: Model<TaskUser>,
    @InjectModel('Label')
    private labelModel: Model<Label>,
    @InjectModel('Task_Checklist')
    private taskChecklistModel: Model<TaskChecklist>,
  ) {}

  async getList(userId: string) {
    try {
      const productWorkCenter = await this.productWorkCenterModel.find({
        users: userId,
      });
      const boardIds = productWorkCenter.map((e) => e.board);
      const boards = await this.boardModel.find({ _id: { $in: boardIds } });
      return classToPlain(
        new BoardsResponse(toJsObject(paginator(boards, 0, boards.length))),
      );
    } catch (error) {
      errorException(error);
    }
  }

  async update(board: Board, boardDTO: UpdateBoardDTO) {
    try {
      const newBoard = await this.boardModel.findByIdAndUpdate(
        board._id,
        boardDTO,
        { new: true },
      );
      return classToPlain(new BoardResponse(toJsObject(newBoard)));
    } catch (error) {
      errorException(error);
    }
  }

  async getDetail(board: Board) {
    try {
      // TODO: is_active
      const taskGroups = await this.taskGroupModel
        .find({ board: board._id })
        .populate({
          path: 'status',
          select: '_id name',
          model: 'Task_Status',
        })
        .lean();
      for await (const taskGroup of taskGroups) {
        const tasks = await this.taskModel
          .find({
            task_group: taskGroup._id,
          })
          .populate([{ path: 'labels', select: '_id name', model: 'Label' }])
          .lean();
        for await (const task of tasks) {
          const taskUsers: any = await this.taskUserModel
            .find({ task: task._id })
            .populate('user')
            .lean();
          const users: User[] = taskUsers.map((e): User => e.user);
          task['users'] = users.map((user) => ({
            _id: user._id,
            name: user.name,
            image: user.image,
          }));
          const checkLists = await this.taskChecklistModel.find({
            task: task._id,
          });
          const numberOfUnFinished = (
            await checkLists.filter((checklist) => checklist.is_complete)
          ).length;
          task['task_checklist'] = `${numberOfUnFinished}/${checkLists.length}`;
        }
        taskGroup['tasks'] = tasks;
      }
      board['task_groups'] = taskGroups;
      return classToPlain(new BoardDetailResponse(toJsObject(board)));
    } catch (error) {
      errorException(error);
    }
  }

  async findBoardById(boardId: string) {
    try {
      return await this.boardModel.findById(boardId);
    } catch (error) {
      errorException(error);
    }
  }
}
