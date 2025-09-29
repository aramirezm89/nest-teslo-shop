import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(private readonly configService: ConfigService) {
    // Configure Cloudinary with URL from environment
    const cloudinaryUrl = this.configService.get<string>('CLOUDINARY_URL');
    if (cloudinaryUrl) {
      // Parse the Cloudinary URL format: cloudinary://api_key:api_secret@cloud_name
      const url = new URL(cloudinaryUrl);
      cloudinary.config({
        cloud_name: url.hostname,
        api_key: url.username,
        api_secret: url.password,
        secure: true,
      });
    }
  }

  uploadProductImage(file: Express.Multer.File) {
    const { filename, originalname } = file;
    this.logger.log(originalname);
    return filename;
  }

  async uploadProductImages(images: Array<Express.Multer.File>) {
    try {
      const uploadPromises = images.map(async (image) => {
        try {
          const base64Image = image.buffer.toString('base64');

          return cloudinary.uploader
            .upload(`data:${image.mimetype};base64,${base64Image}`, {
              folder: 'nest-products',
            })
            .then((result) => result.secure_url);
        } catch (error) {
          console.log(error);
          return null;
        }
      });

      const imagesUrls = await Promise.all(uploadPromises);
      return imagesUrls;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteProductImageCloudinary(
    /*TODO: imageId: number, */ cloudinaryUrl: string,
  ) {
    // "https://res.cloudinary.com/my-cloudinary-ar/image/upload/v1759107380/nest-products/eemtkh3pizxnsld5babn.png"

    // Dividir por "/" y quitar los segmentos de versión + extensión
    const parts = cloudinaryUrl.split('/');

    const withoutVersion = parts.slice(7).join('/'); // "products/czqm3y7xgfixgwsam2wz.avif"

    const publicId = withoutVersion.replace(/\.[^/.]+$/, ''); // quitar extensión
    this.logger.log(`publicId: ${publicId}`);
    try {
      const cloudinaryResult = await cloudinary.uploader.destroy(publicId);
      if (cloudinaryResult.result !== 'ok') {
        throw new BadRequestException(
          'Error al eliminar la imagen en Cloudinary',
        );
      }
      this.logger.log(`Imagen eliminada correctamente: ${publicId}`);
      //todo console.log("borrando de la base de datos");
      return {
        ok: true,
        message: 'Imagen eliminada correctamente',
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Error al eliminar la imagen en Cloudinary',
      );
    }
  }
}
