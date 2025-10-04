import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator((data, req: ExecutionContext) => {
  const ctx = req.switchToHttp();
  const request = ctx.getRequest();
  const user = request.user;
  if (!user) {
    throw new InternalServerErrorException(
      'Usuario no encontrado en la request',
    );
  }

  if (data) {
    return user[data];
  }
  return user;
});
