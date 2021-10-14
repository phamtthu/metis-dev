import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { errorException } from 'src/common/utils/error';
import { Board } from 'src/model/board/board-schema';
import { ProductWorkCenter } from 'src/model/product-workcenter/product-workcenter.schema';

@Injectable()
export class ProductWorkCenterService {
  constructor(
    @InjectModel('Product_WorkCenter')
    private productWorkcenterModel: Model<ProductWorkCenter>,
    @InjectModel('Board')
    private boardModel: Model<Board>,
  ) {}

  async findById(productWCId: string) {
    try {
      const productWC = await this.productWorkcenterModel
        .findById(productWCId)
        .lean();
      if (!productWC)
        throw new NotFoundException('Product Work Center is not exist');
      return productWC;
    } catch (error) {
      errorException(error);
    }
  }

  async checkBoardMember(boardId: string, userId: string) {
    try {
      const board = await this.boardModel.findById(boardId).lean();
      if (!board) throw new NotFoundException('Board is not exist');
      const productWC = await this.productWorkcenterModel.findOne({
        board: boardId,
      });
      if (!productWC)
        throw new NotFoundException(
          'Can not find any Product Work Center realted to this Board',
        );
      const result = productWC.users
        .map((e) => String(e))
        .includes(String(userId));
      if (result) return board;
      else throw new ForbiddenException('User is not a member of this Board');
    } catch (error) {
      errorException(error);
    }
  }
}
