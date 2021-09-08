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
    Request
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './utils/file-upload.utils';
import { ImageDto } from './dto/image-dto';
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
    async uploadedFile(@Request() req, @Body() body: ImageDto, @UploadedFile() file) {
        const baseUrl = this.getBaseUrl(req);
        console.log(baseUrl);
        const response = {
            originalname: file.originalname,
            filename: file.filename,
            path: baseUrl + '/upload/tmp/' + file.filename
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
        files.forEach(file => {
            const fileReponse = {
                originalname: file.originalname,
                filename: file.filename,
                path: '/upload/tmp/' + file.filename
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
        return proto.split(/\s*,\s*/)[0] + "://" + req.headers.host;;
    }
}