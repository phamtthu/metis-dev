import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { classToPlain } from 'class-transformer';
import { Model, PaginateModel } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SortQuery } from 'src/common/enum/filter.enum';
import { errorException } from 'src/common/utils/error';
import { Board } from 'src/model/board/board-schema';
import { ProductWorkCenter } from 'src/model/product-workcenter/product-workcenter.schema';
import { generateRandomCode, paginator, toJsObject } from 'src/shared/helper';
import { UpdateBoardDTO } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel('Board')
    private boardModel: PaginateModel<Board>,
    @InjectModel('Product_WorkCenter')
    private productWorkCenterModel: PaginateModel<ProductWorkCenter>,
  ) {}

  async getList(userId: string) {
    try {
      const productWorkCenter = await this.productWorkCenterModel.find({
        users: userId,
      });
      const boardIds = productWorkCenter.map((e) => e.board);
      const boards = await this.boardModel.find({ _id: { $in: boardIds } });
      return paginator(boards);
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
      return newBoard;
    } catch (error) {
      errorException(error);
    }
  }
}
