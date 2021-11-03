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
  getUniqueFolder,
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
        destination: getUniqueFolder,
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
    console.log(file);
    const response = {
      originalname: file.originalname,
      filename: file.filename,
      path:
        baseUrl +
        file.destination.slice('./public'.length) +
        '/' +
        file.filename,
    };
    return response;
  }

  @Post('/api/upload-multi-image')
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      storage: diskStorage({
        destination: getUniqueFolder,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadMultipleFiles(@Request() req, @UploadedFiles() files) {
    const response = [];
    const baseUrl = this.getBaseUrl(req);
    files.forEach((file) => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
        path:
          baseUrl +
          file.destination.slice('./public'.length) +
          '/' +
          file.filename,
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
        destination: getUniqueFolder,
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
        path:
          baseUrl +
          file.destination.slice('./public'.length) +
          '/' +
          file.filename,
      };
      response.push(fileReponse);
    });
    return response;
  }

  @Post('api/upload-file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: getUniqueFolder,
        filename: keepExtensionFileName,
      }),
    }),
  )
  uploadFiles(@UploadedFile() file, @Request() req) {
    const baseUrl = this.getBaseUrl(req);
    const fileReponse = {
      originalname: file.originalname,
      filename: file.filename,
      path:
        baseUrl +
        file.destination.slice('./public'.length) +
        '/' +
        file.filename,
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
