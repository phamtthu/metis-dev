import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardMemberGuard } from 'src/auth/guard/board-members.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { messageError } from 'src/common/utils/error';
import { getOriginURL } from 'src/shared/helper';
import { AttachmentService } from './attachment.service';
import { AddAttachmentDto } from './dto/add-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';

@Controller('api/attachment')
@UsePipes(
  new ValidationPipe({
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
@UseGuards(JwtAuthGuard, BoardMemberGuard)
export class AttachmentController {
  constructor(private attachmentService: AttachmentService) {}

  @Post()
  async create(@Request() req, @Body() attachmentDto: AddAttachmentDto) {
    try {
      const originURL = getOriginURL(req);
      const result = await this.attachmentService.create(
        attachmentDto,
        req.user._id,
        originURL,
      );
      return {
        message: 'Create Attachment successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

  @Put('/:attachmentId')
  async update(
    @Request() req,
    @Body() attachmentDto: UpdateAttachmentDto,
    @Param('attachmentId') attachmentId: string,
  ) {
    try {
      const result = await this.attachmentService.update(
        attachmentId,
        attachmentDto,
      );
      return {
        message: 'Update Attachment successfully',
        data: result,
      };
    } catch (error) {
      messageError(error);
    }
  }

    @Delete('/:attachmentId')
    async softDelete(
      @Request() req,
      @Param('attachmentId') attachmentId: string,
    ) {
      try {
        await this.attachmentService.softDelete(attachmentId);
        return {
          message: 'Soft Delete Attachment successfully',
        };
      } catch (error) {
        messageError(error);
      }
    }

    @Get('/restore/:attachmentId')
    async restore(@Request() req, @Param('attachmentId') attachmentId: string) {
      try {
        const result = await this.attachmentService.restore(attachmentId);
        return {
          message: 'Restore Attachment successfully',
          data: result,
        };
      } catch (error) {
        messageError(error);
      }
    }
}
