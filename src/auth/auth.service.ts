import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  LoginUserDto,
  CreateUserDto,
  UpdateUserDto,
  GoogleTokenDto,
} from './dto';
import { JwtPayload } from './interfaces';
// JwtService: Servicio de NestJS para firmar y verificar tokens JWT
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  private readonly googleOAuthClient: OAuth2Client;
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // JwtService: Inyectado automáticamente gracias a la configuración en AuthModule
    private readonly jwtService: JwtService,

    private readonly configService: ConfigService,
  ) {
    this.googleOAuthClient = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...rest } = createUserDto;
      const user = this.userRepository.create({
        ...rest,
        password: bcrypt.hashSync(password, 10),
      });
      const { password: _, ...userBd } = await this.userRepository.save(user);
      return {
        ...userBd,
        // Genera un token JWT con el payload del usuario
        token: this.getJwtToken({
          email: user.email,
          fullname: user.fullname,
          id: user.id,
        }),
      };
    } catch (error) {
      this.handleDbException(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, ...rest } = loginUserDto;
    const userBd = await this.userRepository.findOne({
      where: { email: rest.email },
      select: ['email', 'password', 'fullname', 'isActive', 'roles', 'id'],
    });
    if (!userBd) {
      throw new UnauthorizedException('User not found');
    }
    if (!bcrypt.compareSync(password, userBd.password)) {
      throw new UnauthorizedException('Password not found');
    }
    const { password: _, ...user } = userBd;
    return {
      ...user,
      // Genera un token JWT con el payload del usuario autenticado
      token: this.getJwtToken({
        email: user.email,
        fullname: user.fullname,
        id: user.id,
      }),
    };
  }

  checkAuthStatus(user: User) {
    const { password: _, ...userBd } = user;
    return {
      ...userBd,
      // Genera un token JWT con el payload del usuario autenticado
      token: this.getJwtToken({
        email: user.email,
        fullname: user.fullname,
        id: user.id,
      }),
    };
  }

  async verifyGoogleToken(token: GoogleTokenDto) {
    console.log(token);
    const ticket = await this.googleOAuthClient.verifyIdToken({
      idToken: token.token,
    });
    const payload = ticket.getPayload();
    this.logger.log(payload);
    if (!payload) {
      throw new UnauthorizedException('Google token not found');
    }
    const { email, name, picture } = payload;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['email', 'password', 'fullname', 'isActive', 'roles', 'id'],
    });
    if (!user) {
      this.logger.log('Usuario no encontrado');
      this.logger.log('Creando usuario');
      const user = this.userRepository.create({
        email,
        fullname: name,
        password: bcrypt.hashSync('123456', 10),
      });
      await this.userRepository.save(user);
      this.logger.log('Usuario creado y logeado');
      return {
        ...user,
        // Genera un token JWT con el payload del usuario autenticado
        token: this.getJwtToken({
          email: user.email,
          fullname: user.fullname,
          id: user.id,
        }),
      };
    }
    const { password: _, ...userBd } = user;
    this.logger.log('Usuario encontrado y logeado');
    return {
      ...userBd,
      // Genera un token JWT con el payload del usuario autenticado
      token: this.getJwtToken({
        email: user.email,
        fullname: user.fullname,
        id: user.id,
      }),
    };
  }
  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async deleteAllUsers() {
    try {
      await this.userRepository.deleteAll();
      this.logger.log('Todos los usuarios han sido eliminados');
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Error al eliminar todos los usuarios');
    }
  }

  /**
   * Genera un token JWT firmado con el payload proporcionado
   *
   * @param payload - Datos que se incluirán en el token (email, fullname)
   * @returns string - Token JWT firmado que el cliente usará para autenticarse
   *
   * El token se firma con el secreto configurado en JWT_SECRET y expira según
   * la configuración en AuthModule (2h por defecto)
   */
  private getJwtToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
  private handleDbException(error: any): never {
    this.logger.error(error);
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('Por favor revise los logs');
  }
}
