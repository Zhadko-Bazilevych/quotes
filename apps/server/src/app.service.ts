import { Injectable } from '@nestjs/common';
import { KyselyService } from 'src/database/kysely.service';
import { CompiledQuery } from 'kysely';

@Injectable()
export class AppService {
  constructor(private readonly db: KyselyService) {}

  async test(): Promise<{ test: 1 }> {
    const { rows } = await this.db.executeQuery<{ test: 1 }>(
      CompiledQuery.raw('select 1 as test', []),
    );

    return rows[0];
  }
}
