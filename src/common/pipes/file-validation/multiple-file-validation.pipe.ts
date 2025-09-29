import {
  BadRequestException,
  ArgumentMetadata,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class MultipleFileValidationPipe implements PipeTransform {
  private readonly logger = new Logger(MultipleFileValidationPipe.name);

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      this.logger.error('No se enviaron archivos');
      throw new BadRequestException('No se enviaron archivos');
    }

    // Verificar que sea un array
    if (!Array.isArray(value)) {
      this.logger.error('Se esperaba un array de archivos');
      throw new BadRequestException('Se esperaba un array de archivos');
    }

    // Verificar que el array no esté vacío
    if (value.length === 0) {
      this.logger.error('No se enviaron archivos');
      throw new BadRequestException('No se enviaron archivos');
    }

    // Validar cada archivo individualmente
    value.forEach((file, index) => {
      if (!file) {
        this.logger.error(`El archivo en la posición ${index} está vacío`);
        throw new BadRequestException(
          `El archivo en la posición ${index} está vacío`,
        );
      }

      const { size, mimetype } = file;

      if (size > 10000000) {
        this.logger.error(
          `El archivo en la posición ${index} debe pesar menos de 10MB`,
        );
        throw new BadRequestException(
          `El archivo en la posición ${index} debe pesar menos de 10MB`,
        );
      }

      if (!mimetype.startsWith('image')) {
        this.logger.error(
          `El archivo en la posición ${index} debe ser una imagen`,
        );
        throw new BadRequestException(
          `El archivo en la posición ${index} debe ser una imagen`,
        );
      }
    });

    this.logger.log(`${value.length} archivos válidos`);
    this.logger.log(typeof value);
    return value;
  }
}
