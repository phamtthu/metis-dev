import * as fs from 'fs-extra';
import * as fetch from 'node-fetch';
import { nanoid } from 'nanoid';
import { readdirSync, promises } from 'fs';
import { NotFoundException } from '@nestjs/common';

// - Create
export const getNewImgLink = async (imgLink, folderName, serverURL) => {
  try {
    if (imgLink.includes(`${serverURL}/upload/tmp/`)) {
      // Belong to tmp folder of server
      await fs.ensureDir(`./public/upload/${folderName}`);
      const oldPath = `./public${new URL(imgLink).pathname}`;
      const fileName = oldPath.split('/')[oldPath.split('/').length - 1];

      const uniqueFolderName = await generateUniqueFolderName(
        `./public/upload/${folderName}/`,
      );
      const newPath = `./public/upload/${folderName}/${uniqueFolderName}/${fileName}`;

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
      const fileName = imgLink.split('/')[imgLink.split('/').length - 1];

      const uniqueFolderName = await generateUniqueFolderName(
        `./public/upload/${folderName}/`,
      );
      const newPath = `./public/upload/${folderName}/${uniqueFolderName}/${fileName}`;
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
      fileName = fileName.trim().replace(/[^a-z0-9.]+/gi, '-');
      let uniqueFolderName = await generateUniqueFolderName(
        `./public/upload/${folderName}/`,
      );
      const path = `./public/upload/${folderName}/${uniqueFolderName}/${fileName}`;
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

const getFolderNamesAtGivenPath = async (path) => {
  try {
    const result = await promises.readdir(path, { withFileTypes: true });
    return result.filter((item) => item.isDirectory()).map((item) => item.name);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const generateUniqueFolderName = async (path) => {
  let uniqueFolderName = '';
  const folderNames = await getFolderNamesAtGivenPath(path);
  do {
    uniqueFolderName = `${nanoid(10)}`;
  } while (folderNames.includes(uniqueFolderName));
  return uniqueFolderName;
};
