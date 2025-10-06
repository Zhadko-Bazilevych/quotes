import { Module } from '@nestjs/common';
import { AuthFactory } from 'src/auth/auth.provider';
import { PostgresDialectService } from 'src/database/postgres-dialect.service';

@Module({
  providers: [AuthFactory, PostgresDialectService],
  exports: [AuthFactory],
})
export class AuthConfigModule {}
