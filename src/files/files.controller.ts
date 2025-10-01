import {
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Query,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import {
  FileValidationPipe,
  MultipleFileValidationPipe,
} from '../common/pipes/file-validation';
import { FilesService } from './files.service';
import fileNamerHelper from './helpers/file-namer.helper';
import { createReadStream } from 'fs';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('product/:imageName')
  @Header('Content-Type', 'image/jpeg')
  @Header('Content-Disposition', 'inline')
  getProductImageFileSysten(
    @Param('imageName') imageName: string,
  ): StreamableFile {
    const path = this.filesService.getProductImageFileSystem(imageName);
    const file = createReadStream(path);
    return new StreamableFile(file);
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multer.diskStorage({
        destination: './static/products',
        filename: fileNamerHelper,
      }),
    }),
  )
  uploadProductImage(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ) {
    return this.filesService.uploadProductImage(file);
  }

  @Post('products')
  @UseInterceptors(FilesInterceptor('images'))
  uploadUserImage(
    @UploadedFiles(new MultipleFileValidationPipe())
    files: Array<Express.Multer.File>,
  ) {
    return this.filesService.uploadProductImages(files);
  }

  @Delete('product')
  deleteProductImage(@Query('cloudinaryUrl') cloudinaryUrl: string) {
    return this.filesService.deleteProductImageCloudinary(cloudinaryUrl);
  }
}
