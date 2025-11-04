import type { Request } from 'express';
import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export const ActiveSession = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const session = request.session;
    return session;
  },
);
