import {
  Controller,
  Delete,
  Param,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  FileValidationPipe,
  MultipleFileValidationPipe,
} from '../common/pipes/file-validation';
import { FilesService } from './files.service';
import multer from 'multer';
import fileNamerHelper from './helpers/file-namer.helper';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

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
