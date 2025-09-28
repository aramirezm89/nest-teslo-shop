import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from '../common/pipes/file-validation/file-validation.pipe';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(FileInterceptor('image'))
  uploadProductImage(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ) {
    return this.filesService.uploadProductImage(file);
  }
}
