import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
// Passport: Biblioteca de autenticación para Node.js que soporta múltiples estrategias
import { PassportModule } from '@nestjs/passport';
// JWT: Módulo para manejar JSON Web Tokens en NestJS
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
// Estrategia personalizada de JWT que extiende PassportStrategy
import { JwtStrategy } from './strategy/jwt-strategy';
@Module({
  controllers: [AuthController],
  // JwtStrategy: Proveedor que implementa la validación de tokens JWT
  providers: [AuthService, JwtStrategy],
  imports: [
    // Registra la entidad User para que se pueda inyectar su repositorio en el módulo
    TypeOrmModule.forFeature([User]),

    // PassportModule: Configura Passport con JWT como estrategia por defecto
    // Esto permite usar @UseGuards(AuthGuard()) sin especificar la estrategia
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JwtModule: Configuración asíncrona para obtener el secreto desde variables de entorno
    // registerAsync permite inyectar dependencias (ConfigService) en la configuración
    JwtModule.registerAsync({
      imports: [ConfigModule], // Importa ConfigModule para acceder a ConfigService
      inject: [ConfigService], // Inyecta ConfigService en la factory function
      useFactory: (configService: ConfigService) => ({
        // Obtiene el secreto JWT desde las variables de entorno
        secret: configService.get<string>('JWT_SECRET'),
        // Configuración del token: expira en 2 horas
        signOptions: { expiresIn: '2h' },
      }),
    }),
  ],
  // Exporta servicios para que otros módulos puedan usarlos
  // JwtStrategy y PassportModule son necesarios para guards en otros módulos
  exports: [JwtStrategy, JwtModule, PassportModule, TypeOrmModule],
})
export class AuthModule {}
