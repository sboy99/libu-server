/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Errors from '@/utils/exceptions/errors';
import type { RequestHandler } from 'express';
import multer from 'multer';

function createStorage(dir: string): multer.StorageEngine {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./tmp${dir}`);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

  return storage;
}

interface IImageUploadOptions {
  uploadType: 'single' | 'multiple';
  uploadLimit?: number;
  maxUploadSize: number;
}

const imageUploader = (
  fieldName: string,
  options: IImageUploadOptions,
  dir = ''
): RequestHandler => {
  const { uploadType, uploadLimit, maxUploadSize } = options;

  const storage = createStorage(dir);
  const maxFileSize = maxUploadSize * 1024 * 1024;

  const uploader = multer({
    storage,
    limits: {
      fileSize: maxFileSize,
    },
    fileFilter: function (req, file, cb) {
      if (!file.mimetype.startsWith('image')) {
        return cb(new Errors.BadRequestError('only image files are allowed'));
      }
      cb(null, true);
    },
  });

  if (uploadType === 'multiple') return uploader.array(fieldName, uploadLimit);
  return uploader.single(fieldName);
};

export default imageUploader;
