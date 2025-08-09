import { Pool } from 'pg';
import {
  CamelCasePlugin,
  ColumnType,
  Generated,
  Insertable,
  Kysely,
  PostgresDialect,
  Selectable,
  Updateable,
} from 'kysely';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/config/config.configuration';

export interface Database {
  quote: QuoteTable;
}

interface QuoteTable {
  id: Generated<number>;
  user: string;
  author: string;
  content: string;
  context: string;
  createdAt: ColumnType<Date, never, never>;
  updatedAt: ColumnType<Date, never, Date>;
}

export type Quote = Selectable<QuoteTable>;
export type NewQuote = Insertable<QuoteTable>;
export type UpdateQuote = Updateable<QuoteTable>;

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
