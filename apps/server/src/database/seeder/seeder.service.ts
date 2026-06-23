import { KyselyService } from 'src/database/kysely.service';

import { Injectable } from '@nestjs/common';

@Injectable()
export class SeederService {
  constructor(private readonly db: KyselyService) {}
  async seed(): Promise<void> {
    this.db.ctx.insertInto('user');
    return Promise.resolve();
  }
}
