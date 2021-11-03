import {
  Body,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Controller,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { messageError } from 'src/common/utils/error';
import { BoardMemberGuard } from 'src/auth/guard/board-members.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { TaskGroupService } from './task-group.service';
import { AddTaskGroupDto } from './dto/add-task-group.dto';
import { UpdateTaskGroupDto } from './dto/update-task-group.dto';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/common/enum/filter.enum';

@Controller('api/task-group')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
@UseGuards(JwtAuthGuard, RolesGuard, BoardMemberGuard)
@Roles(Role.Employee)
export class TaskGroupController {
  constructor(private taskGroupService: TaskGroupService) {}

  @Post()
  async create(@Request() req, @Body() taskGroupDto: AddTaskGroupDto) {
    try {
      const result = await this.taskGroupService.create(taskGroupDto);
      return {
        message: 'Create TaskGroup successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Put('/:taskGroupId')
  async update(
    @Request() req,
    @Body() taskGroupDto: UpdateTaskGroupDto,
    @Param('taskGroupId') taskGroupId: string,
  ) {
    try {
      const result = await this.taskGroupService.update(
        taskGroupId,
        taskGroupDto,
      );
      return {
        message: 'Update TaskGroup successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Delete('/:taskGroupId')
  async softDelete(@Request() req, @Param('taskGroupId') taskGroupId: string) {
    try {
      await this.taskGroupService.softDelete(taskGroupId);
      return {
        message: 'Soft Delete Task Group successfully',
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Get('restore/:taskGroupId')
  async restore(@Request() req, @Param('taskGroupId') taskGroupId: string) {
    try {
      const result = await this.taskGroupService.restore(taskGroupId);
      return {
        message: 'Restore Task Group successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }
}
