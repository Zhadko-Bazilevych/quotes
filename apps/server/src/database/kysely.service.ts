import { types } from 'pg';
import { CamelCasePlugin, Kysely } from 'kysely';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { QuoteTable } from 'src/database/tables/quote.tables';
import { UserTable } from 'src/database/tables/user.tables';
import { AccountTable } from 'src/database/tables/account.tables';
import { SessionTable } from 'src/database/tables/session.tables';
import { VerificationTable } from 'src/database/tables/verification.tables';
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
