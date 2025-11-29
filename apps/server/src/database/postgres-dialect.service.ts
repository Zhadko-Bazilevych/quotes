import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Config } from 'src/config/config.types';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostgresDialectService extends PostgresDialect {
  constructor(config: ConfigService<Config, true>) {
    super({
      pool: new Pool({
        database: config.get('db.database', { infer: true }),
        host: config.get('db.host', { infer: true }),
        user: config.get('db.user', { infer: true }),
        password: config.get('db.password', { infer: true }),
        port: config.get('db.port', { infer: true }),
        max: 10,
      }),
    });
  }
}
