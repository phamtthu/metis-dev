import {
  Body,
  ClassSerializerInterceptor,
  Delete,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Put,
  Query,
  Request,
  Response,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { throwCntrllrErr } from 'src/common/utils/error';
import { AddUserDTO } from './dto/add-user.dto';
import { UpdateUserDTO } from './dto/update-user';
import { UserService } from './user.service';

import { getOriginURL } from 'src/shared/helper';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('api/user')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Request() req, @Body() userDTO: AddUserDTO) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.userService.create(userDTO, originURL);
      return {
        message: 'Create User successfully',
        data: result,
      };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get()
  async getList(@Request() req, @Query() queryDto: PaginationQueryDto) {
    try {
      const result = await this.userService.getList(queryDto);
      return { data: result };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get('/:userId')
  async getDetail(@Request() req, @Param('userId') userId: string) {
    try {
      const result = await this.userService.getDetail(userId);
      return { data: result };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Delete('/:userId')
  async delete(
    @Request() req,
    @Response() res,
    @Param('userId') userId: string,
  ) {
    try {
      await this.userService.delete(userId);
      return {
        message: 'Delete User successfully',
      };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Put('/:userId')
  async update(
    @Request() req,
    @Param('userId') userId: string,
    @Body() userDTO: UpdateUserDTO,
  ) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.userService.update(userId, userDTO, originURL);
      return {
        message: 'Update User successfully',
        data: result,
      };
    } catch (error) {
      throwCntrllrErr(error);
    }
  }
}
