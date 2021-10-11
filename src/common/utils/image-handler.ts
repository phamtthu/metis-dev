import * as fs from 'fs-extra';
import * as fetch from 'node-fetch';
import { nanoid } from 'nanoid';
import { readdirSync } from 'fs';
import { NotFoundException } from '@nestjs/common';

// - Create
export const getNewImgLink = async (imgLink, folderName, serverURL) => {
  try {
    if (imgLink.includes(`${serverURL}/upload/tmp/`)) {
      // Belong to tmp folder of server
      await fs.ensureDir(`./public/upload/${folderName}`);
      const oldPath = `./public${new URL(imgLink).pathname}`;
      const oldFileName = oldPath.split('/')[oldPath.split('/').length - 1];
      // Generate unique name file
      let newFileName = '';
      let files = [];
      do {
        files = readdirSync(`./public/upload/${folderName}`);
        newFileName = `${nanoid(10)}-${oldFileName}`;
      } while (files.includes(newFileName));

      const newPath = `./public/upload/${folderName}/${newFileName}`;

      if (await fs.pathExists(oldPath)) {
        await fs.move(oldPath, newPath);
        const newLink = `${new URL(imgLink).origin}${newPath.slice(8)}`;
        return newLink;
      } else {
        throw new NotFoundException('File is not exist.');
      }
    } else if (imgLink.includes(`${serverURL}/upload/`)) {
      // Not belong to tmp folder of server
      await fs.ensureDir(`./public/upload/${folderName}`);
      const nanoidRegex = new RegExp(/^.{0,10}/);
      const oldPath = `./public/${imgLink.substring(serverURL.length + 1)}`;
      const oldFileName = imgLink.split('/')[imgLink.split('/').length - 1];
      // Generate unique name file
      let newFileName = '';
      let files = [];
      do {
        files = readdirSync(`./public/upload/${folderName}`);
        newFileName = oldFileName.replace(nanoidRegex, nanoid(10));
      } while (files.includes(newFileName));
      const newPath = `./public/upload/${folderName}/${newFileName}`;
      if (await fs.pathExists(oldPath)) {
        await fs.ensureDir(`./public/upload/${folderName}`);
        await fs.copy(oldPath, newPath);
        // return newLink
        return `${serverURL}/${newPath.slice(8)}`;
      } else {
        throw new NotFoundException('File is not exist.');
      }
    } else {
      // Belong to other server
      // Download and create file
      const response = await fetch(imgLink);
      const buffer = await response.buffer();
      let fileName = imgLink.split('/')[imgLink.split('/').length - 1];
      fileName = fileName.trim().replace(/[^a-z0-9]+/gi, '-');
      const path = `./public/upload/${folderName}/${nanoid(10)}-${fileName}`;
      await fs.ensureFile(path);
      await fs.writeFile(path, buffer);
      const newLink = `${new URL(serverURL).origin}${path.slice(8)}`;
      return newLink;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete Img
export const deleteImgPath = async (oldImgLink: string) => {
  try {
    if (oldImgLink === null) return;
    const imgPath = `./public${new URL(oldImgLink).pathname}`;
    await fs.remove(imgPath);
  } catch (error) {
    throw new Error(error.message);
  }
};
