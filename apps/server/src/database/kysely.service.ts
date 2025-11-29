import { AsyncLocalStorage } from 'node:async_hooks';

import {
  AccessMode,
  CamelCasePlugin,
  IsolationLevel,
  Kysely,
  Transaction,
} from 'kysely';
import { ResultAsync } from 'neverthrow';
import { types } from 'pg';
import { PostgresDialectService } from 'src/database/postgres-dialect.service';
import { AccountTable } from 'src/database/tables/account.tables';
import { QuoteTable } from 'src/database/tables/quote.tables';
import { SessionTable } from 'src/database/tables/session.tables';
import { UserTable } from 'src/database/tables/user.tables';
import { VerificationTable } from 'src/database/tables/verification.tables';

import { Injectable, OnModuleDestroy } from '@nestjs/common';

export interface Database {
  quote: QuoteTable;
  user: UserTable;
  account: AccountTable;
  session: SessionTable;
  verification: VerificationTable;
}

types.setTypeParser(types.builtins.INT8, Number);

export type TransactionParams = {
  accessMode?: AccessMode;
  isolationLevel?: IsolationLevel;
};

export type DbContext = Kysely<Database> | Transaction<Database>;

export type DbContextStorage = {
  trx: DbContext;
  transactionParams: TransactionParams;
};

@Injectable()
export class InternalKyselyService
  extends Kysely<Database>
  implements OnModuleDestroy
{
  private readonly storage = new AsyncLocalStorage<DbContextStorage>();

  constructor(dialect: PostgresDialectService) {
    super({ dialect, plugins: [new CamelCasePlugin()] });
  }

  get ctx(): DbContext {
    return this.storage.getStore()?.trx ?? this;
  }

  override get isTransaction(): boolean {
    return this.storage.getStore() !== undefined;
  }

  withTransaction<T, E>(
    fn: () => ResultAsync<T, E>,
    { accessMode, isolationLevel }: TransactionParams = {},
  ): ResultAsync<T, E> {
    // TODO: check accessMode and isolationLevel inconsistencies
    // for nested transactions
    if (this.isTransaction) {
      return fn();
    }

    let t = this.transaction();
    if (accessMode) {
      t.setAccessMode(accessMode);
    }
    if (isolationLevel) {
      t = t.setIsolationLevel(isolationLevel);
    }

    return ResultAsync.fromPromise(
      (async (): Promise<T> => {
        return await t.execute(async (trx) => {
          const res = await this.storage.run(
            {
              trx,
              transactionParams: {
                isolationLevel,
                accessMode,
              },
            },
            fn,
          );
          if (res.isErr()) {
            // eslint-disable-next-line @typescript-eslint/only-throw-error
            throw res.error;
          }
          return res.value;
        });
      })(),
      (errRes) => errRes as E,
    );
  }

  async onModuleDestroy(): Promise<void> {
    await this.destroy();
  }
}

export abstract class KyselyService {
  abstract get ctx(): Omit<DbContext, 'transaction' | 'startTransaction'>;
  abstract get isTransaction(): boolean;

  abstract withTransaction<T, E>(
    fn: () => ResultAsync<T, E>,
    params?: TransactionParams,
  ): ResultAsync<T, E>;
}
