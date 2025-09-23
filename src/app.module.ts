import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { envSchema } from './configuration/env.validationSchema';
import { ServeStaticModule } from '@nestjs/serve-static';
@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      // Hace que ConfigModule esté disponible globalmente sin importar en cada módulo
      isGlobal: true,
      // Valida las variables de entorno usando Joi al iniciar la aplicación
      validationSchema: envSchema,
    }),
    // Configuración de archivos estáticos
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
