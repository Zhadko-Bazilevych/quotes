import { Pool } from 'pg';
import {
  ColumnType,
  Generated,
  Insertable,
  Kysely,
  PostgresDialect,
  Selectable,
  Updateable,
} from 'kysely';
import { Injectable } from '@nestjs/common';

const dialect = new PostgresDialect({
  pool: new Pool({
    database: 'quotes',
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    port: 5432,
    max: 10,
  }),
});

interface Database {
  quote: QuoteTable;
}

interface QuoteTable {
  id: Generated<number>;
  user: string;
  author: string;
  content: string;
  context: string;
  created_at: ColumnType<Date, never, never>;
  updated_at: ColumnType<Date, never, Date>;
}

export type Quote = Selectable<QuoteTable>;
export type NewQuote = Insertable<QuoteTable>;
export type UpdateQuote = Updateable<QuoteTable>;

@Injectable()
export class KyselyService extends Kysely<Database> {
  constructor() {
    super({ dialect });
  }
}
