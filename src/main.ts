import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function main() {
  const logger = new Logger('main');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      // Remueve automáticamente propiedades no definidas en el DTO (seguridad feature)
      // Solo permite propiedades que tengan decoradores de validación
      // Esto previene ataques de mass assignment y datos no deseados
      whitelist: true,
      // Lanza BadRequestException si el cliente envía propiedades no permitidas
      // Previene ataques de mass assignment y datos no deseados
      forbidNonWhitelisted: true,
      // Habilita la transformación automática de datos basada en tipos TypeScript y decoradores
      // Convierte el payload JSON plano en instancias de clase DTO con tipos correctos
      transform: true,
      // Configuraciones adicionales para el proceso de transformación
      transformOptions: {
        // Permite conversiones implícitas de tipos sin decoradores @Type() explícitos
        // Ejemplo: string "123" → number 123, string "true" → boolean true
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
  logger.log(`App running on port ${process.env.PORT ?? 3000}`);
}
main();
