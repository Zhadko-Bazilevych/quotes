import { KyselyService } from 'src/database/kysely.service';

import { Injectable } from '@nestjs/common';

@Injectable()
export class Seeder {
  constructor(private readonly db: KyselyService) {}
  seed(): void {
    this.db.ctx.insertInto('user');
  }
}
