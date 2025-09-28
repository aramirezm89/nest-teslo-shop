import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  uploadProductImage(file: Express.Multer.File) {
    const { filename, originalname } = file;
    this.logger.log(originalname);
    return filename;
  }
}
