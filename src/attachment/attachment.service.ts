import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { classToPlain } from 'class-transformer';
import { Model, PaginateModel } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { errorException } from 'src/common/utils/error';
import { getNewImgLink } from 'src/common/utils/image-handler';
import { Attachment } from 'src/model/attachment/attachment-schema';
import { toJsObject } from 'src/shared/helper';
import { AddAttachmentDto } from './dto/add-attachment.dto';
import { AttachmentResponse } from './response/attachment-response';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import axios from 'axios';
const prettyBytes = require('pretty-bytes');
const fs = require('fs');

@Injectable()
export class AttachmentService {
  constructor(
    @InjectModel('Attachment')
    private attachmentModel: SoftDeleteModel<Attachment> &
      PaginateModel<Attachment>,
  ) {}

  async getTitleFromUrl(url: string) {
    try {
      const response = await axios.get(url);
      const pageData = response.data;
      const regex = new RegExp(/<title.*?>(.*)<\/title>/g);
      let title = pageData.match(regex);
      title = title[0].slice(7, title.length - 8);
      return title.split('-')[0].trim();
    } catch (error) {
      errorException(error);
    }
  }

  async create(attachmentDto: AddAttachmentDto, userId: string, originURL) {
    try {
      if (!attachmentDto.name) {
        if (attachmentDto.type === 0) {
          attachmentDto.link = await getNewImgLink(
            attachmentDto.link,
            'attachments',
            originURL,
          );
          const fileName =
            attachmentDto.link.split('/')[
              attachmentDto.link.split('/').length - 1
            ];
          attachmentDto.name = fileName;
          attachmentDto['download_link'] = this.getDownloadLink(
            originURL,
            attachmentDto.link,
          );
          attachmentDto['size'] = this.getSizeOfFile(
            originURL,
            attachmentDto.link,
          );
        } else {
          attachmentDto.name = await this.getTitleFromUrl(attachmentDto.link);
        }
      }
      const attachment = await new this.attachmentModel({
        created_by: userId,
        ...attachmentDto,
      }).save();
      return classToPlain(new AttachmentResponse(toJsObject(attachment)));
    } catch (error) {
      errorException(error);
    }
  }

  getDownloadLink(originURL: string, link: string) {
    const path = link.slice(originURL.length + 1);
    const encodePath = encodeURIComponent(path);
    const downloadLink = originURL + '/api/download/' + encodePath;
    return downloadLink;
  }

  getSizeOfFile(originUrl: string, link: string) {
    try {
      const path = link.slice(originUrl.length + 1);
      const { size } = fs.statSync('public/' + path);
      return prettyBytes(parseInt(size));
    } catch (error) {
      errorException(error);
    }
  }

  async update(attachmentId: string, attachmentDto: UpdateAttachmentDto) {
    try {
      const newAttachment = await this.attachmentModel.findByIdAndUpdate(
        attachmentId,
        attachmentDto,
        { new: true },
      );
      return classToPlain(new AttachmentResponse(toJsObject(newAttachment)));
    } catch (error) {
      errorException(error);
    }
  }

  async findAttachmentById(attachmentId: string) {
    const attachment = await this.attachmentModel
      .findById(attachmentId)
      .populate('task')
      .lean();
    if (!attachment) throw new NotFoundException('Attachment is not exist');
    return attachment;
  }

  async softDelete(attachmentId: string) {
    try {
      const { n } = await this.attachmentModel.deleteById(attachmentId);
      if (n !== 1) throw new Error('Can not soft delete Attachment');
    } catch (error) {
      errorException(error);
    }
  }

  async restore(attachmentId: string) {
    try {
      let attachment: any = await this.attachmentModel.findById(attachmentId);
      if (!attachment.deleted)
        throw new BadRequestException('Attachment is already restored');
      const { n } = await this.attachmentModel.restore({ _id: attachmentId });
      if (n !== 1) throw new Error('Can not restore Attachment');
      attachment = await this.attachmentModel.findById(attachmentId);
      return classToPlain(new AttachmentResponse(toJsObject(attachment)));
    } catch (error) {
      errorException(error);
    }
  }
}
