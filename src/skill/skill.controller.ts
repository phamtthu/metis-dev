import {
  Body,
  Delete,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { messageError } from 'src/common/utils/error';
import { AddSkillDTO } from './dto/add-skill.dto';
import { SkillService } from './skill.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { UpdateSkillDTO } from './dto/update-skill.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role } from 'src/common/enum/filter.enum';
import { Roles } from 'src/auth/roles.decorator';

@Controller('api/skill')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
export class SkillController {
  constructor(private skillService: SkillService) {}

  @Post()
  async create(@Request() req, @Body() skillDTO: AddSkillDTO) {
    try {
      const result = await this.skillService.create(skillDTO);
      return {
        message: 'Create Skill successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Get()
  async getList(@Request() req, @Query() queryDto: PaginationQueryDto) {
    try {
      const result = await this.skillService.getList(queryDto);
      return result;
    } catch (error) {
      messageError(error);
    }
  }

  @Get('/:skillId')
  async getDetail(@Request() req, @Param('skillId') skillId: string) {
    try {
      const result = await this.skillService.getDetail(skillId);
      return { data: result };
    } catch (error) {
      messageError(error);
    }
  }

  @Delete('/:skillId')
  async delete(@Request() req, @Param('skillId') skillId: string) {
    try {
      await this.skillService.delete(skillId);
      return {
        message: 'Delete Skill successfully',
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Put('/:skillId')
  async update(
    @Request() req,
    @Body() skillDTO: UpdateSkillDTO,
    @Param('skillId') skillId: string,
  ) {
    try {
      const result = await this.skillService.update(skillId, skillDTO);
      return {
        message: 'Update Skill successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }
}
