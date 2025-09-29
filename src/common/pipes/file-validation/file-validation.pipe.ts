import {
  BadRequestException,
  ArgumentMetadata,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly logger = new Logger(FileValidationPipe.name);

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      this.logger.error('No se envio ningun archivo');
      throw new BadRequestException('No se envio ningun archivo');
    }
    const { size, mimetype } = value;

    if (size > 10000000) {
      this.logger.error('El archivo debe pesar menos de 10MB');
      throw new BadRequestException('El archivo debe pesar menos de 10MB');
    }

    if (!mimetype.startsWith('image')) {
      this.logger.error('El archivo debe ser una imagen');
      throw new BadRequestException('El archivo debe ser una imagen');
    }

    this.logger.log('Archivo valido');
    this.logger.log(typeof value);
    return value;
  }
}
