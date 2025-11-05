import { Global, Module } from '@nestjs/common';
import {
  InternalKyselyService,
  KyselyService,
} from 'src/database/kysely.service';
import { PostgresDialectService } from 'src/database/postgres-dialect.service';

@Global()
@Module({
  providers: [
    {
      provide: KyselyService,
      useClass: InternalKyselyService,
    },
    InternalKyselyService,
    PostgresDialectService,
  ],
  exports: [KyselyService, InternalKyselyService],
})
export class KyselyModule {}
