import type { IUploadedImage } from '@/interfaces/app.interface';
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
    imagePath: string,
    folder?: string
  ): Promise<IUploadedImage> => {
    const { public_id, secure_url } = await this.uploader.upload(imagePath, {
      folder,
    });
    await this.deleteTempFile(imagePath);
    return {
      id: public_id,
      url: secure_url,
    };
  };
}

export default ImageUploadService;
