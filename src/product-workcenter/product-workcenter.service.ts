import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { errorException } from 'src/common/utils/error';
import { ProductWorkCenter } from 'src/model/product-workcenter/product-workcenter.schema';

@Injectable()
export class ProductWorkCenterService {
  constructor(
    @InjectModel('Product_WorkCenter')
    private productWorkCenterService: Model<ProductWorkCenter>,
  ) {}

  async findProductWCById(productWCId: string) {
    try {
      const productWC = await this.productWorkCenterService
        .findById(productWCId)
        .lean();
      if (!productWC)
        throw new NotFoundException('Product Work Center is not exist');
      return productWC;
    } catch (error) {
      errorException(error);
    }
  }
}
