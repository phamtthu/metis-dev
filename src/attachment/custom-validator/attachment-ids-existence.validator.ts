import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { AttachmentService } from '../attachment.service';

@ValidatorConstraint({ name: 'AttachmentExistValidator', async: true })
@Injectable()
export class AttachmentExistValidator implements ValidatorConstraintInterface {
  constructor(private attachmentService: AttachmentService) {}

  async validate(ids: string[], args: ValidationArguments) {
    try {
      if (ids instanceof Array && ids.length === 0) return true;
      else if (ids instanceof Array) {
        if (new Set(ids).size !== ids.length) return false;
        const attachmentIds = await this.attachmentService.findAllIds();
        return ids.every((val) => attachmentIds.includes(val));
      } else {
        const result = await this.attachmentService.findAttachmentById(ids);
        if (result) return true;
        else return false;
      }
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Attachment ID must be exist and do not contain duplicate values';
  }
}
