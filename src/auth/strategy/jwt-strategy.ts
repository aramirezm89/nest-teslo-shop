// passport-jwt: Estrategia de Passport para autenticación con JWT
import { ExtractJwt, Strategy } from 'passport-jwt';
// PassportStrategy: Clase base de NestJS para crear estrategias de Passport personalizadas
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { ValidateUserPayload } from '../interfaces';

/**
 * JwtStrategy: Estrategia personalizada de JWT para Passport
 *
 * Esta clase extiende PassportStrategy y define cómo validar tokens JWT.
 * Se ejecuta automáticamente cuando se usa @UseGuards(AuthGuard()) en un endpoint.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    // Configuración de la estrategia JWT para Passport
    super({
      // Extrae el token JWT del header Authorization como Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Secreto para verificar la firma del token (debe coincidir con el usado para firmarlo)
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  /**
   * Método validate: Se ejecuta automáticamente después de verificar el token JWT
   *
   * @param payload - Datos decodificados del token JWT (definidos en JwtPayload)
   * @returns User - Usuario validado que se inyectará en el request como req.user
   *
   * Flujo:
   * 1. Passport verifica la firma del token con el secreto
   * 2. Si es válido, decodifica el payload y llama a este método
   * 3. Este método valida que el usuario existe y está activo
   * 4. Si todo es correcto, retorna el usuario completo
   * 5. El usuario se inyecta automáticamente en req.user
   */
  async validate(payload: JwtPayload): Promise<ValidateUserPayload> {
    const { id } = payload;

    // Busca el usuario en la base de datos usando el email del token
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new UnauthorizedException('Token no válido');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario no activo');
    }

    const { password, ...rest } = user;
    this.logger.log('Usuario validado: ', {
      ...rest,
    });
    // El usuario retornado se inyectará automáticamente en req.user
    return rest;
  }
}
