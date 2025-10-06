import { types } from 'pg';
import { CamelCasePlugin, Kysely } from 'kysely';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { QuoteTable } from 'src/database/types/quote.types';
import { UserTable } from 'src/database/types/user.types';
import { AccountTable } from 'src/database/types/account.types';
import { SessionTable } from 'src/database/types/session.types';
import { VerificationTable } from 'src/database/types/verification.types';
import { PostgresDialectService } from 'src/database/postgres-dialect.service';

export interface Database {
  quote: QuoteTable;
  user: UserTable;
  account: AccountTable;
  session: SessionTable;
  verification: VerificationTable;
}

types.setTypeParser(types.builtins.INT8, Number);

@Injectable()
export class KyselyService extends Kysely<Database> implements OnModuleDestroy {
  constructor(dialect: PostgresDialectService) {
    super({ dialect, plugins: [new CamelCasePlugin()] });
  }

  async onModuleDestroy(): Promise<void> {
    await this.destroy();
  }
}
