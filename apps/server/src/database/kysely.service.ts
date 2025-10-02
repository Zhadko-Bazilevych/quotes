import { Pool, types } from 'pg';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/config/config.configuration';
import { QuoteTable } from 'src/database/types/quote.types';

export interface Database {
  quote: QuoteTable;
}

types.setTypeParser(types.builtins.INT8, Number);

@Injectable()
export class KyselyService extends Kysely<Database> implements OnModuleDestroy {
  constructor(config: ConfigService<Config, true>) {
    const dialect = new PostgresDialect({
      pool: new Pool({
        database: config.get('db.database', { infer: true }),
        host: config.get('db.host', { infer: true }),
        user: config.get('db.user', { infer: true }),
        password: config.get('db.password', { infer: true }),
        port: config.get('db.port', { infer: true }),
        max: 10,
      }),
    });

    super({ dialect, plugins: [new CamelCasePlugin()] });
  }

  async onModuleDestroy(): Promise<void> {
    await this.destroy();
  }
}
