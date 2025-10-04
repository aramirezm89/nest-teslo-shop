import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getRawHeaders = createParamDecorator(
  (data, req: ExecutionContext) => {
    const ctx = req.switchToHttp();
    const request = ctx.getRequest();
    return request.rawHeaders;
  },
);
