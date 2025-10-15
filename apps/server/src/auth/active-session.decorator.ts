import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { SessionRequest } from 'src/auth/auth.guard';

export const ActiveSession = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<SessionRequest>();
    const session = request['session'];
    return session;
  },
);
