import { Module } from '@nestjs/common';
import { AuthFactory } from 'src/auth/auth.provider';

@Module({
  providers: [AuthFactory],
  exports: [AuthFactory],
})
export class AuthModule {}
