import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginUserDto,
  CreateUserDto,
  UpdateUserDto,
  GoogleTokenDto,
} from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators';
import { User } from './entities/user.entity';
import { getRawHeaders } from 'src/common/decorators/get-rawheaders.decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { UserRole } from './interfaces';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Post('google')
  verifyGoogleToken(@Body() googleTokenDto: GoogleTokenDto) {
    return this.authService.verifyGoogleToken(googleTokenDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }
  @Get('private')
  @UseGuards(AuthGuard('jwt'))
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @getRawHeaders() rawHeaders: string[],
    @Headers() headers: string[],
  ) {
    return {
      user,
      message: 'Esta es una routa privada',
      userEmail,
      rawHeaders,
      headers,
    };
  }

  //  @SetMetadata('roles', ['admin'])

  @Get('private2')
  @RoleProtected(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), UserRoleGuard)
  testingPrivateRoute2(@GetUser() user: User) {
    return {
      user,
      message: 'Esta es una routa privada',
    };
  }

  @Get('private3')
  @Auth(UserRole.ADMIN)
  testingPrivateRoute3(@GetUser() user: User) {
    return {
      user,
      message: 'Esta es una routa privada',
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
