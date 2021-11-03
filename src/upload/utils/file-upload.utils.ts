import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';
import { generateUniqueFolderName } from 'src/common/utils/image-handler';
import { removeVietnameseTones } from 'src/shared/helper';
import * as fs from 'fs-extra';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    let rs = {
      message: 'Validation errors in your request',
      errors: {
        image: ['Only image files are allowed!'],
      },
    };
    return callback(
      new HttpException(rs, HttpStatus.UNPROCESSABLE_ENTITY),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  let fileName = file.originalname.slice(0, file.originalname.lastIndexOf('.'));
  fileName = removeVietnameseTones(fileName.trim());
  // Replace special character with "-"
  fileName = fileName.replace(/[^a-z0-9]+/gi, '-');
  // remove white space
  fileName = fileName.split('.')[0].replace(/ /g, '');
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${fileName}${fileExtName}`);
};

export const keepExtensionFileName = (req, file, callback) => {
  callback(
    null,
    `${removeVietnameseTones(
      file.originalname.slice(0, file.originalname.lastIndexOf('.')),
    )
      .replace(/[^a-z0-9.]+/gi, '-')
      .replace(/ /g, '')}${extname(file.originalname)}`,
  );
};

export const getUniqueFolder = async (req, file, callback) => {
  let rootPath = './public/upload/tmp';
  const uniqueFoldername = await generateUniqueFolderName(rootPath);
  const path = `${rootPath}/${uniqueFoldername}`;
  await fs.ensureDir(path);
  callback(null, path);
};
