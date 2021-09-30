import {
  Body,
  Delete,
  HttpStatus,
  Post,
  Put,
  Query,
  Request,
  Response,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { throwCntrllrErr } from 'src/common/utils/error';
import { AddSkillDTO } from './dto/add-skill.dto';
import { SkillService } from './skill.service';
import { Request as ERequest } from 'express';
import { Response as EResponse } from 'express';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { UpdateSkillDTO } from './dto/update-skill.dto';
import { SkillID } from 'src/shared/pipe/skillId.pipe';

@Controller('api/skill')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
export class SkillController {
  constructor(private skillService: SkillService) {}

  @Post()
  async create(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Body() skillDTO: AddSkillDTO,
  ) {
    try {
      const result = await this.skillService.create(skillDTO);
      return res.status(HttpStatus.CREATED).json({
        message: 'Create Skill successfully',
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get()
  async getList(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Query('search') search: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    try {
      const result = await this.skillService.getList(
        { offset, limit },
        search?.trim(),
      );
      return res.status(HttpStatus.OK).json({
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get('user/:skillId')
  async getUsersWithGivenSkill(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Param('skillId', SkillID) skillId: string,
    @Query() paginateQuery: PaginationQueryDto,
  ) {
    try {
      const result = await this.skillService.getUsersWithGivenSkill(
        skillId,
        paginateQuery,
      );
      return res.status(HttpStatus.OK).json({
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Get('/:skillId')
  async getDetail(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Param('skillId', SkillID) skillId: string,
  ) {
    try {
      const result = await this.skillService.getDetail(skillId);
      return res.status(HttpStatus.OK).json({
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Delete('/:skillId')
  async delete(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Param('skillId', SkillID) skillId: string,
  ) {
    try {
      await this.skillService.delete(skillId);
      return res.status(HttpStatus.OK).json({
        message: 'Delete Skill successfully',
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }

  @Put('/:skillId')
  async update(
    @Request() req: ERequest,
    @Response() res: EResponse,
    @Body() skillDTO: UpdateSkillDTO,
    @Param('skillId', SkillID) skillId: string,
  ) {
    try {
      const result = await this.skillService.update(skillId, skillDTO);
      return res.status(HttpStatus.OK).json({
        message: 'Update Skill successfully',
        data: result,
      });
    } catch (error) {
      throwCntrllrErr(error);
    }
  }
}
