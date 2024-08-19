/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import config from '../config';
import { ICloudinaryRes, IFile } from '../interface/file';

export const upload = multer({ dest: path.join(process.cwd(), '/uploads') });

cloudinary.config({
  cloud_name: config.cloud_cloud_name,
  api_key: config.cloud_api_key,
  api_secret: config.cloud_api_secret,
});

export const uploadToCloud = async (
  file: IFile,
  id: string,
): Promise<ICloudinaryRes> => {
  return new Promise(async (resolve, reject) => {
    try {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        public_id: id,
        folder: 'ph_health',
      });

      resolve(uploadResult as any);
    } catch (error) {
      reject(error);
    }
    await fs.unlink(file.path, () => {
      console.log('File Delete Success...');
    });
  });
};
