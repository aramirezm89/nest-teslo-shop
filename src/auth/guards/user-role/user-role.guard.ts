import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
import { META_ROLES } from 'src/auth/decorators/role-protected/role-protected.decorator';
import { UserRole } from 'src/auth/interfaces';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles = this.reflector.get<UserRole[]>(
      META_ROLES,
      context.getHandler(),
    );

    // If no roles are required, allow access
    if (!validRoles || validRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // Check if user has any of the required roles
    const hasValidRole = user.roles.some((role) => validRoles.includes(role));

    if (!hasValidRole) {
      throw new ForbiddenException(
        `Usuario ${user.fullname} necesita un rol valido: [${validRoles.join(', ')}]`,
      );
    }

    return true;
  }
}
