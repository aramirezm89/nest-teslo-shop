import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  // Registra la entidad Product para que se pueda inyectar su repositorio en el módulo
  imports: [TypeOrmModule.forFeature([User])],
})
export class AuthModule {}
