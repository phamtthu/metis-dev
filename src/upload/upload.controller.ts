import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Res,
  Param,
  Body,
  Request,
  Response,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  editFileName,
  imageFileFilter,
  keepExtensionFileName,
} from './utils/file-upload.utils';
import { ImageDto } from './dto/image-dto';

import { messageError } from 'src/common/utils/error';
import * as fs from 'fs-extra';

@Controller()
export class UploadController {
  @Post('/api/upload-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/upload/tmp',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedFile(
    @Request() req,
    @Body() body: ImageDto,
    @UploadedFile() file,
  ) {
    const baseUrl = this.getBaseUrl(req);
    console.log(baseUrl);
    const response = {
      originalname: file.originalname,
      filename: file.filename,
      path: baseUrl + '/upload/tmp/' + file.filename,
    };
    return response;
  }

  @Post('/api/upload-multi-image')
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './public/upload/tmp',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadMultipleFiles(@UploadedFiles() files) {
    const response = [];
    files.forEach((file) => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
        path: '/upload/tmp/' + file.filename,
      };
      response.push(fileReponse);
    });
    return response;
  }

  @Get('api/image/:imgpath')
  async getUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './upload/image' });
  }

  private getBaseUrl = (req) => {
    let proto = req.connection.encrypted ? 'https' : 'http';
    proto = req.headers['x-forwarded-proto'] || proto;
    return proto.split(/\s*,\s*/)[0] + '://' + req.headers.host;
  };

  @Post('api/upload-multi-file')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: './public/upload/tmp',
        filename: keepExtensionFileName,
      }),
    }),
  )
  uploadFile(@UploadedFiles() files, @Request() req) {
    const baseUrl = this.getBaseUrl(req);
    const response = [];
    files.forEach((file) => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
        path: baseUrl + '/upload/tmp/' + file.filename,
      };
      response.push(fileReponse);
    });
    return response;
  }

  @Post('api/upload-file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/upload/tmp',
        filename: keepExtensionFileName,
      }),
    }),
  )
  uploadFiles(@UploadedFile() file, @Request() req) {
    const baseUrl = this.getBaseUrl(req);
    const fileReponse = {
      originalname: file.originalname,
      filename: file.filename,
      path: baseUrl + '/upload/tmp/' + file.filename,
    };
    return fileReponse;
  }

  @Get('/api/download/:encodePath')
  async download(
    @Request() req,
    @Response() res,
    @Param('encodePath') encodePath: string,
  ) {
    try {
      const path = decodeURIComponent(encodePath);
      if (!(await fs.pathExists(`./public/${path}`)))
        throw new NotFoundException('File is not found');
      res.download(`./public/${path}`);
    } catch (error) {
      messageError(error);
    }
  }
}
