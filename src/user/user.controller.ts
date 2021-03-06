import {
  Body,
  Delete,
  Post,
  Put,
  Query,
  Request,
  Response,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { messageError } from 'src/common/utils/error';
import { AddUserDTO } from './dto/add-user.dto';
import { UpdateUserDTO } from './dto/update-user';
import { UserService } from './user.service';
import { getOriginURL } from 'src/shared/helper';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/common/enum/filter.enum';

@Controller('api/user')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async create(@Request() req, @Body() userDTO: AddUserDTO) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.userService.create(userDTO, originURL);
      return {
        message: 'Create User successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getList(@Request() req, @Query() queryDto: PaginationQueryDto) {
    try {
      const result = await this.userService.getList(queryDto);
      return result;
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/auth/me')
  @UseGuards(JwtAuthGuard)
  async getMyDetail(@Request() req) {
    try {
      const result = await this.userService.getDetail(req.user._id);
      return { data: result };
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getDetail(@Request() req, @Param('userId') userId: string) {
    try {
      const result = await this.userService.getDetail(userId);
      return { data: result };
    } catch (error) {
      messageError(error);
    }
  }

  @Delete('/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
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
      messageError(error);
    }
  }

  @Put('/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
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
      messageError(error);
    }
  }
}
