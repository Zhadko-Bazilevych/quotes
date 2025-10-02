import { Module } from '@nestjs/common';
import { AuthFactory } from 'src/auth/auth.provider';
import { KyselyService } from 'src/database/kysely.service';

@Module({
  providers: [AuthFactory, KyselyService],
  exports: [AuthFactory],
})
export class AuthConfigModule {}
