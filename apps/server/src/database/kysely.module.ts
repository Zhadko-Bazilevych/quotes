import { Module } from '@nestjs/common';
import { KyselyService } from 'src/database/kysely.service';
import { PostgresDialectService } from 'src/database/postgres-dialect.service';

@Module({
  providers: [KyselyService, PostgresDialectService],
  exports: [KyselyService],
})
export class KyselyModule {}
