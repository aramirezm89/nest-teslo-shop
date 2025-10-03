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
import { LoginUserDto, CreateUserDto, UpdateUserDto } from './dto';
import { JwtPayload } from './interfaces';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

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
        token: this.getJwtToken({ email: user.email, fullname: user.fullname }),
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
      token: this.getJwtToken({ email: user.email, fullname: user.fullname }),
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
