import {
  Body,
  Delete,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { messageError } from 'src/common/utils/error';
import { ItemService } from './item.service';
import { AddItemDto } from './dto/add-item.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { BoardMemberGuard } from 'src/auth/guard/board-members.guard';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('api/item')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
@UseGuards(JwtAuthGuard, BoardMemberGuard)
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get('/path')
  async getFilePath() {
    try {
    } catch (error) {
      messageError(error);
    }
  }

  @Post()
  async create(@Request() req, @Body() itemDto: AddItemDto) {
    try {
      const result = await this.itemService.create(itemDto, req.user._id);
      return {
        message: 'Create Item successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Delete('/:itemId')
  async softDelete(@Request() req, @Param('itemId') itemId: string) {
    try {
      await this.itemService.softDelete(itemId);
      return {
        message: 'Soft Delete Item successfully',
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Get('restore/:itemId')
  async restore(@Request() req, @Param('itemId') itemId: string) {
    try {
      const result = await this.itemService.restore(itemId);
      return {
        message: 'Restore Item successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Put('/:itemId')
  async update(
    @Request() req,
    @Body() itemDto: UpdateItemDto,
    @Param('itemId') itemId: string,
  ) {
    try {
      const result = await this.itemService.update(itemId, itemDto);
      return {
        message: 'Update Item successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }
}
