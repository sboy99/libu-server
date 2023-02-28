import type { IUploadedImage } from '@/interfaces/app.interface';
import Errors from '@/utils/exceptions/errors';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

class ImageUploadService {
  private uploader = cloudinary.uploader;

  private deleteTempFile = async (fPath: string) => {
    await fs.unlink(fPath);
  };
  /**
   *
   */
  public uploadToCloudinary = async (
    filePath: string,
    folder?: string
  ): Promise<IUploadedImage> => {
    try {
      const { public_id, secure_url } = await this.uploader.upload(filePath, {
        folder,
      });
      return {
        id: public_id,
        url: secure_url,
      };
    } catch (error) {
      throw new Errors.BadRequestError('image upload failed');
    } finally {
      await this.deleteTempFile(filePath);
    }
  };
}

export default ImageUploadService;
