import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';

export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        let rs = {
            message: "Validation errors in your request",
            errors: {
                'image': ["Only image files are allowed!"]
            },
        }
        return callback(new HttpException(rs, HttpStatus.UNPROCESSABLE_ENTITY), false);
    }
    callback(null, true);
};

export const editFileName = (req, file, callback) => {
    // Replace special character with "-"
    let name = file.originalname.trim().replace(/[^a-z0-9]+/gi, '-')
    // remove white space
    name = name.split('.')[0].replace(/ /g, '')
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};

export const keepExtensionFileName = (req, file, callback) => {
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('')
    callback(null, `${randomName}-${file.originalname}`);
};
