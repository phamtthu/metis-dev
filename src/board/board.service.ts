import { Injectable, BadRequestException } from '@nestjs/common';
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
import { TaskChecklist } from 'src/model/task-checklist/task-checklist.schema';
import { BoardDetailResponse } from './response/board-detail-response';
import { BoardResponse } from './response/board-response';
import { BoardsResponse } from './response/boards-response';
import { SortQuery } from 'src/common/enum/filter.enum';
import { SoftDeleteModel } from 'mongoose-delete';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel('Board')
    private boardModel: PaginateModel<Board> & SoftDeleteModel<Board>,
    @InjectModel('Product_WorkCenter')
    private productWorkCenterModel: PaginateModel<ProductWorkCenter>,
    @InjectModel('Task')
    private taskModel: PaginateModel<Task>,
    @InjectModel('Task_Group')
    private taskGroupModel: PaginateModel<TaskGroup>,
    @InjectModel('Task_User')
    private taskUserModel: Model<TaskUser>,
    @InjectModel('Task_Checklist')
    private taskChecklistModel: Model<TaskChecklist>,
    @InjectModel('Comment')
    private commentModel: Model<Comment>,
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
          .sort({ index: SortQuery.Desc })
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
          const numberOfcomments = (
            await this.commentModel.find({ task: task._id })
          ).length;
          task['comments'] = numberOfcomments;
        }
        taskGroup['tasks'] = tasks;
      }
      board['task_groups'] = taskGroups;
      return classToPlain(new BoardDetailResponse(toJsObject(board)));
    } catch (error) {
      errorException(error);
    }
  }

  async softDelete(boardId: string) {
    try {
      const { n } = await this.boardModel.deleteById(boardId);
      if (n === 1) {
        await this.boardModel.findByIdAndUpdate(boardId, { index: null });
      } else {
        throw new Error('Can not soft delete Task');
      }
    } catch (error) {
      errorException(error);
    }
  }

  async restore(boardId: string) {
    try {
      const board: any = await this.boardModel.findById(boardId);
      const { n } = await this.boardModel.restore({ _id: boardId });
      if (!board.deleted)
        throw new BadRequestException('Board is already restored');
      if (n === 1) {
        const board = await this.boardModel.findById(boardId);
        return classToPlain(new BoardResponse(toJsObject(board)));
      } else {
        throw new Error('Can not restore Board');
      }
    } catch (error) {
      errorException(error);
    }
  }

  async findBoardById(boardId: string) {
    try {
      return await this.boardModel.findById(boardId).lean();
    } catch (error) {
      errorException(error);
    }
  }

  async getWorkingTimeStats() {
    try {
      const hour = 60 * 60 * 1000;
      const boards = await this.boardModel.find().lean();
      for await (const board of boards) {
        const tasks: any = await this.taskModel
          .find({ board: board._id })
          .lean();
        let totalCurrentWorkingMs = 0;
        let totalCurrentOverWorkingMs = 0;
        tasks.forEach((task) => {
          if (task.actual_end_date) {
            const startTime = task.plan_start_date ?? task.created_at;
            totalCurrentWorkingMs =
              totalCurrentWorkingMs +
              new Date(task.actual_end_date).getTime() -
              new Date(startTime).getTime();
            if (
              new Date(task.actual_end_date).getTime() >
              new Date(task.plan_end_date).getTime()
            ) {
              totalCurrentOverWorkingMs =
                totalCurrentOverWorkingMs +
                new Date(task.actual_end_date).getTime() -
                new Date(task.plan_end_date).getTime();
            }
          }
        });
        board['over_time'] = (totalCurrentOverWorkingMs / hour).toFixed(2);
        board['working_time'] = (totalCurrentWorkingMs / hour).toFixed(2);
      }
      return classToPlain(
        new BoardsResponse(toJsObject(paginator(boards, 0, boards.length))),
      );
    } catch (error) {
      errorException(error);
    }
  }
}
